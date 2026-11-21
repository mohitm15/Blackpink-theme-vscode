
import React, { useState, useEffect, useMemo } from "react";

// Types and interfaces
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "developer" | "viewer";
  isActive: boolean;
}

interface UserProfileProps {
  user: User;
  onUpdate?: (user: User) => void;
}

import React, { useEffect, useMemo, useState } from "react";

interface User {
  id: string | number;
  name: string;
  email: string;
  role: "admin" | "editor" | "member" | string;
  isActive: boolean;
}

interface UserProfileProps {
  user: User;
  onUpdate?: (updatedUser: User) => void;
  onOpenAdminDashboard?: () => void;
}

const UserProfile = ({
  user,
  onUpdate,
  onOpenAdminDashboard,
}: UserProfileProps) => {
  const [count, setCount] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(user.name);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Keep local input in sync if the parent passes a different user
  useEffect(() => {
    setUsername(user.name);
    setIsSaved(false);
  }, [user.id, user.name]);

  // Update browser tab title while mounted
  useEffect(() => {
    const previousTitle = document.title;
    const activeName = username.trim() || user.name;
    document.title = `${activeName} | User Profile`;

    return () => {
      document.title = previousTitle;
    };
  }, [username, user.name]);

  const displayRole = useMemo<string>(() => {
    return user.role.trim().toUpperCase();
  }, [user.role]);

  const handleIncrement = (): void => {
    setCount((prev) => prev + 1);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setUsername(event.target.value);
    if (isSaved) {
      setIsSaved(false);
    }
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ): void => {
    event.preventDefault();

    const trimmedName = username.trim();
    if (!trimmedName) return;

    setUsername(trimmedName);
    onUpdate?.({
      ...user,
      name: trimmedName,
    });
    setIsSaved(true);
  };

  return (
    <section className="user-profile" aria-labelledby="user-profile-heading">
      <header className="user-profile__header">
        <h2 id="user-profile-heading">User Profile</h2>
        <p>Welcome, {username || user.name}!</p>
        <span
          className={`status ${user.isActive ? "status--active" : "status--inactive"}`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </header>

      <dl className="profile-details">
        <div className="profile-details__row">
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="profile-details__row">
          <dt>Role</dt>
          <dd>{displayRole}</dd>
        </div>
      </dl>

      {user.role === "admin" && (
        <button
          type="button"
          className="admin-btn"
          onClick={onOpenAdminDashboard}
        >
          Admin Dashboard
        </button>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={handleInputChange}
          placeholder="Enter username"
          required
        />

        <button type="submit" disabled={!username.trim()}>
          Save Changes
        </button>

        {isSaved && (
          <p className="save-confirmation" role="status">
            Profile updated.
          </p>
        )}
      </form>

      <div className="counter">
        <p>Button clicked: {count} times</p>
        <button type="button" onClick={handleIncrement}>
          Increment
        </button>
      </div>

      <div className="extra-section">
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls="extra-user-info"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>

        {isExpanded && (
          <div id="extra-user-info" className="extra-info">
            <p>User ID: {user.id}</p>
            <p>Account Status: {user.isActive ? "Enabled" : "Disabled"}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserProfile;

// Example usage
export default function App(): React.JSX.Element {
  const sampleUser: User = {
    id: 101,
    name: "Mohit",
    email: "mohit@example.com",
    role: "developer",
    isActive: true,
  };

  const handleUserUpdate = (updatedUser: User): void => {
    console.log("Updated user:", updatedUser);
  };

  return (
    <main>
      <h1>React TypeScript Demo</h1>
      <UserProfile
        user={sampleUser}
        onUpdate={handleUserUpdate}
      />
    </main>
  );
}
