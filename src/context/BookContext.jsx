import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { initialBooks, initialBorrowings, initialSettings } from "../data/initialData";

const BookContext = createContext();

const BOOKS_KEY = "bookbase_books";
const BORROWINGS_KEY = "bookbase_borrowings";
const SETTINGS_KEY = "bookbase_settings";
const ACTIVITIES_KEY = "bookbase_activities";

export const BookProvider = ({ children }) => {
  // Books state
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem(BOOKS_KEY);
    return saved ? JSON.parse(saved) : initialBooks;
  });

  // Borrowings state
  const [borrowings, setBorrowings] = useState(() => {
    const saved = localStorage.getItem(BORROWINGS_KEY);
    return saved ? JSON.parse(saved) : initialBorrowings;
  });

  // Settings state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Activities log
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem(ACTIVITIES_KEY);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "act_1",
        userId: "u_user1",
        userName: "Amay Patel",
        type: "BORROW",
        message: "Borrowed 'Clean Code: A Handbook of Agile Software Craftsmanship'",
        timestamp: new Date(Date.now() - 7 * 86400000).toISOString()
      },
      {
        id: "act_2",
        userId: "u_user2",
        userName: "Aniket Verma",
        type: "BORROW",
        message: "Borrowed 'Full-Stack React, TypeScript, and Node'",
        timestamp: new Date(Date.now() - 10 * 86400000).toISOString()
      },
      {
        id: "act_3",
        userId: "u_user1",
        userName: "Amay Patel",
        type: "RETURN",
        message: "Returned 'Designing Data-Intensive Applications'",
        timestamp: new Date(Date.now() - 17 * 86400000).toISOString()
      }
    ];
  });

  // Notifications/Toast helper state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToastMessage({ message, type, id: Date.now() });
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(BORROWINGS_KEY, JSON.stringify(borrowings));
  }, [borrowings]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  }, [activities]);

  const logActivity = (userId, userName, type, message) => {
    const newAct = {
      id: `act_${Date.now()}`,
      userId,
      userName,
      type,
      message,
      timestamp: new Date().toISOString()
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 49)]); // keep recent 50
  };

  // Automated return & due date checker
  // Evaluates whether due date has reached
  const checkDueDatesAndAutoReturn = useCallback(() => {
    const today = new Date();
    let updatedCount = 0;
    let autoReturnedCount = 0;

    setBorrowings((prevBorrowings) => {
      const updated = prevBorrowings.map((bor) => {
        if (bor.status === "Returned") return bor;

        const due = new Date(bor.dueDate);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

        // If due date has passed
        if (diffDays < 0) {
          if (settings.autoReturnOverdue) {
            // Auto return feature as requested in spec:
            // "Borrow/return Book (if due date reached return automatically)"
            autoReturnedCount++;
            return {
              ...bor,
              status: "Returned",
              returnDate: new Date().toISOString().split("T")[0],
              autoReturned: true
            };
          } else {
            return { ...bor, status: "Overdue" };
          }
        } else if (diffDays <= 3) {
          return { ...bor, status: "Due Soon" };
        } else {
          return { ...bor, status: "Active" };
        }
      });

      return updated;
    });

    // If auto returned any books, replenish book inventory
    if (autoReturnedCount > 0) {
      showToast(`Automated check: ${autoReturnedCount} book(s) past due date were automatically returned!`, "info");
    }
  }, [settings.autoReturnOverdue, showToast]);

  // Periodic automatic check (every 30 seconds while app is running)
  useEffect(() => {
    checkDueDatesAndAutoReturn();
    const interval = setInterval(checkDueDatesAndAutoReturn, 30000);
    return () => clearInterval(interval);
  }, [checkDueDatesAndAutoReturn]);

  // Borrow a book
  const borrowBook = (bookId, user) => {
    if (!user) {
      showToast("Please log in to borrow books.", "error");
      return { success: false, error: "Authentication required" };
    }

    if (user.isBlocked) {
      showToast("Your account is currently blocked by administration.", "error");
      return { success: false, error: "Account blocked" };
    }

    const book = books.find((b) => b.id === bookId);
    if (!book) {
      showToast("Book not found.", "error");
      return { success: false, error: "Book not found" };
    }

    if (book.availableCopies <= 0) {
      showToast("Sorry, this book is currently out of stock.", "warning");
      return { success: false, error: "Out of stock" };
    }

    // Check user's active borrowings
    const userActiveBorrowings = borrowings.filter(
      (b) => b.userId === user.id && b.status !== "Returned"
    );

    if (userActiveBorrowings.length >= (settings.maxBooksPerUser || 5)) {
      showToast(`You have reached the maximum borrow limit (${settings.maxBooksPerUser} books). Return a book first.`, "warning");
      return { success: false, error: "Limit reached" };
    }

    // Check if user already has an active loan for this exact book
    const alreadyBorrowed = userActiveBorrowings.some((b) => b.bookId === bookId);
    if (alreadyBorrowed) {
      showToast("You currently have an active loan for this book.", "warning");
      return { success: false, error: "Already borrowed" };
    }

    // Decrement available copies
    setBooks((prevBooks) =>
      prevBooks.map((b) =>
        b.id === bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b
      )
    );

    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + (settings.loanDurationDays || 14));

    const newBorrowing = {
      id: `bor_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      coverImage: book.coverImage,
      borrowDate: now.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      returnDate: null,
      status: "Active"
    };

    setBorrowings((prev) => [newBorrowing, ...prev]);
    logActivity(user.id, user.name, "BORROW", `Borrowed '${book.title}'`);
    showToast(`Successfully borrowed "${book.title}"! Due in ${settings.loanDurationDays || 14} days.`, "success");

    return { success: true, borrowing: newBorrowing };
  };

  // Return a book
  const returnBook = (borrowingId, user) => {
    const borrowing = borrowings.find((b) => b.id === borrowingId);
    if (!borrowing) {
      showToast("Borrow record not found.", "error");
      return { success: false, error: "Not found" };
    }

    if (borrowing.status === "Returned") {
      showToast("This book has already been returned.", "info");
      return { success: false, error: "Already returned" };
    }

    const todayStr = new Date().toISOString().split("T")[0];

    // Mark returned
    setBorrowings((prev) =>
      prev.map((b) =>
        b.id === borrowingId ? { ...b, status: "Returned", returnDate: todayStr } : b
      )
    );

    // Replenish book stock
    setBooks((prevBooks) =>
      prevBooks.map((b) =>
        b.id === borrowing.bookId
          ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) }
          : b
      )
    );

    const userName = user?.name || borrowing.userName;
    const userId = user?.id || borrowing.userId;
    logActivity(userId, userName, "RETURN", `Returned '${borrowing.bookTitle}'`);
    showToast(`"${borrowing.bookTitle}" has been successfully returned to BookBase library.`, "success");

    return { success: true };
  };

  // Admin CRUD for Books
  const addBook = (bookData) => {
    const newBook = {
      ...bookData,
      id: `b_${Date.now()}`,
      totalCopies: parseInt(bookData.totalCopies || bookData.quantity || 5, 10),
      availableCopies: parseInt(bookData.availableCopies || bookData.quantity || 5, 10),
      rating: 4.8,
      reviewsCount: 1,
      coverImage:
        bookData.coverImage ||
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
    };

    setBooks((prev) => [newBook, ...prev]);
    showToast(`Book "${newBook.title}" added to catalog successfully.`, "success");
    return { success: true, book: newBook };
  };

  const updateBook = (bookId, updatedData) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          const totalCopies = parseInt(updatedData.totalCopies || updatedData.quantity || b.totalCopies, 10);
          const diff = totalCopies - b.totalCopies;
          const availableCopies = Math.max(0, b.availableCopies + diff);
          return { ...b, ...updatedData, totalCopies, availableCopies };
        }
        return b;
      })
    );
    showToast("Book details updated successfully.", "success");
    return { success: true };
  };

  const deleteBook = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    showToast(`Book "${book?.title || 'Selected'}" deleted from library catalog.`, "info");
    return { success: true };
  };

  // Admin settings update
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast("Library settings saved successfully.", "success");
  };

  // Simulation feature for Demo & Testing
  // Simulates passage of time so examiners can test auto-return & overdue immediately
  const simulateTimeTravel = (days) => {
    const shiftMs = days * 24 * 60 * 60 * 1000;
    setBorrowings((prev) =>
      prev.map((b) => {
        if (b.status === "Returned") return b;
        const curDue = new Date(b.dueDate);
        const newDue = new Date(curDue.getTime() - shiftMs);
        const curBorrow = new Date(b.borrowDate);
        const newBorrow = new Date(curBorrow.getTime() - shiftMs);
        return {
          ...b,
          borrowDate: newBorrow.toISOString().split("T")[0],
          dueDate: newDue.toISOString().split("T")[0]
        };
      })
    );

    setTimeout(() => {
      checkDueDatesAndAutoReturn();
    }, 100);

    showToast(`Time simulated by ${days} days! Active loans and due dates have been adjusted.`, "warning");
  };

  // Reset to initial sample data
  const resetAllData = () => {
    localStorage.removeItem(BOOKS_KEY);
    localStorage.removeItem(BORROWINGS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(ACTIVITIES_KEY);
    setBooks(initialBooks);
    setBorrowings(initialBorrowings);
    setSettings(initialSettings);
    showToast("All sample data has been reset to defaults.", "info");
  };

  // Helper getters
  const getUserBorrowings = (userId) => {
    return borrowings.filter((b) => b.userId === userId);
  };

  const getUserStats = (userId) => {
    const userLoans = borrowings.filter((b) => b.userId === userId);
    const totalBorrowed = userLoans.length;
    const currentlyBorrowed = userLoans.filter((b) => b.status === "Active" || b.status === "Due Soon").length;
    const returned = userLoans.filter((b) => b.status === "Returned").length;
    const dueBooks = userLoans.filter((b) => b.status === "Due Soon" || b.status === "Overdue").length;

    return {
      totalBorrowed,
      currentlyBorrowed,
      returned,
      dueBooks
    };
  };

  const getAdminStats = () => {
    const totalBooks = books.reduce((acc, b) => acc + (b.totalCopies || 1), 0);
    const activeBorrowings = borrowings.filter((b) => b.status !== "Returned");
    const totalBorrowed = activeBorrowings.length;
    const overdueCount = borrowings.filter((b) => b.status === "Overdue").length;

    return {
      totalBooks,
      totalTitles: books.length,
      borrowedCount: totalBorrowed,
      overdueCount
    };
  };

  return (
    <BookContext.Provider
      value={{
        books,
        borrowings,
        settings,
        activities,
        toastMessage,
        showToast,
        hideToast,
        borrowBook,
        returnBook,
        addBook,
        updateBook,
        deleteBook,
        updateSettings,
        simulateTimeTravel,
        checkDueDatesAndAutoReturn,
        resetAllData,
        getUserBorrowings,
        getUserStats,
        getAdminStats
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};
