// src/pages/Homepage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pagescss/homepage.css';

const Homepage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [progress, setProgress] = useState({
    weight: 75,
    bodyFat: 18,
    muscleMass: 45
  });
  const [newWorkout, setNewWorkout] = useState({
    type: '',
    duration: '',
    calories: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [newGoal, setNewGoal] = useState({
    type: 'weight',
    target: '',
    deadline: ''
  });
  const [showLogout, setShowLogout] = useState(false);
  
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  // Check if user is logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn !== 'true') {
      navigate('/');
    }
  }, [navigate]);

  // Sample initial data
  useEffect(() => {
    setWorkouts([
      { id: 1, type: 'Running', duration: 30, calories: 300, date: '2024-01-15' },
      { id: 2, type: 'Weight Training', duration: 45, calories: 250, date: '2024-01-14' },
      { id: 3, type: 'Yoga', duration: 60, calories: 200, date: '2024-01-13' }
    ]);

    setGoals([
      { id: 1, type: 'weight', target: 70, current: 75, deadline: '2024-03-01', completed: false },
      { id: 2, type: 'running', target: 5, current: 3, deadline: '2024-02-01', completed: false }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/');
  };

  const addWorkout = (e) => {
    e.preventDefault();
    const workout = {
      id: workouts.length + 1,
      ...newWorkout,
      duration: parseInt(newWorkout.duration),
      calories: parseInt(newWorkout.calories)
    };
    setWorkouts([...workouts, workout]);
    setNewWorkout({
      type: '',
      duration: '',
      calories: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const addGoal = (e) => {
    e.preventDefault();
    const goal = {
      id: goals.length + 1,
      ...newGoal,
      target: parseInt(newGoal.target),
      current: progress[newGoal.type] || 0,
      completed: false
    };
    setGoals([...goals, goal]);
    setNewGoal({
      type: 'weight',
      target: '',
      deadline: ''
    });
  };

  const completeGoal = (goalId) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, completed: true } : goal
    ));
  };

  const deleteWorkout = (workoutId) => {
    setWorkouts(workouts.filter(workout => workout.id !== workoutId));
  };

  const calculateWeeklyProgress = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyWorkouts = workouts.filter(workout => 
      new Date(workout.date) >= oneWeekAgo
    );
    
    return {
      totalWorkouts: weeklyWorkouts.length,
      totalCalories: weeklyWorkouts.reduce((sum, workout) => sum + workout.calories, 0),
      totalDuration: weeklyWorkouts.reduce((sum, workout) => sum + workout.duration, 0)
    };
  };

  const weeklyProgress = calculateWeeklyProgress();

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <i className="fas fa-dumbbell"></i>
              FitTrack
            </div>
            <nav className="main-nav">
              <button 
                className={activeTab === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
                onClick={() => setActiveTab('dashboard')}
              >
                <i className="fas fa-chart-line"></i>
                Dashboard
              </button>
              <button 
                className={activeTab === 'workouts' ? 'nav-btn active' : 'nav-btn'}
                onClick={() => setActiveTab('workouts')}
              >
                <i className="fas fa-running"></i>
                Workouts
              </button>
              <button 
                className={activeTab === 'goals' ? 'nav-btn active' : 'nav-btn'}
                onClick={() => setActiveTab('goals')}
              >
                <i className="fas fa-bullseye"></i>
                Goals
              </button>
              <button 
                className={activeTab === 'progress' ? 'nav-btn active' : 'nav-btn'}
                onClick={() => setActiveTab('progress')}
              >
                <i className="fas fa-trophy"></i>
                Progress
              </button>
            </nav>
            <div className="user-menu">
              <div 
                className="user-info"
                onMouseEnter={() => setShowLogout(true)}
                onMouseLeave={() => setShowLogout(false)}
              >
                <span>Welcome, {username}!</span>
                <div className="user-avatar">
                  <i className="fas fa-user"></i>
                </div>
                {showLogout && (
                  <div className="logout-dropdown">
                    <button className="logout-btn" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {activeTab === 'dashboard' && (
            <div className="tab-content">
              <h1>Dashboard</h1>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-fire"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Calories Burned</h3>
                    <p className="stat-number">{weeklyProgress.totalCalories}</p>
                    <p className="stat-label">This Week</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Workout Time</h3>
                    <p className="stat-number">{weeklyProgress.totalDuration}m</p>
                    <p className="stat-label">This Week</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-dumbbell"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Workouts</h3>
                    <p className="stat-number">{weeklyProgress.totalWorkouts}</p>
                    <p className="stat-label">This Week</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-bullseye"></i>
                  </div>
                  <div className="stat-info">
                    <h3>Active Goals</h3>
                    <p className="stat-number">{goals.filter(g => !g.completed).length}</p>
                    <p className="stat-label">In Progress</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-content">
                <div className="recent-workouts">
                  <h2>Recent Workouts</h2>
                  <div className="workout-list">
                    {workouts.slice(0, 3).map(workout => (
                      <div key={workout.id} className="workout-item">
                        <div className="workout-type">{workout.type}</div>
                        <div className="workout-details">
                          <span>{workout.duration} min</span>
                          <span>{workout.calories} cal</span>
                        </div>
                        <div className="workout-date">{workout.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="goals-overview">
                  <h2>Current Goals</h2>
                  <div className="goals-list">
                    {goals.filter(g => !g.completed).slice(0, 3).map(goal => (
                      <div key={goal.id} className="goal-item">
                        <div className="goal-info">
                          <h4>{goal.type.toUpperCase()} Goal</h4>
                          <p>Target: {goal.target}</p>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${(goal.current / goal.target) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <button 
                          className="complete-btn"
                          onClick={() => completeGoal(goal.id)}
                        >
                          Complete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workouts' && (
            <div className="tab-content">
              <div className="tab-header">
                <h1>Workout History</h1>
                <button 
                  className="add-btn"
                  onClick={() => document.getElementById('workout-form').scrollIntoView()}
                >
                  <i className="fas fa-plus"></i> Add Workout
                </button>
              </div>

              <div className="workouts-grid">
                {workouts.map(workout => (
                  <div key={workout.id} className="workout-card">
                    <div className="workout-header">
                      <h3>{workout.type}</h3>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteWorkout(workout.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <div className="workout-stats">
                      <div className="stat">
                        <i className="fas fa-clock"></i>
                        <span>{workout.duration} min</span>
                      </div>
                      <div className="stat">
                        <i className="fas fa-fire"></i>
                        <span>{workout.calories} cal</span>
                      </div>
                    </div>
                    <div className="workout-date">{workout.date}</div>
                  </div>
                ))}
              </div>

              <div id="workout-form" className="form-section">
                <h2>Add New Workout</h2>
                <form onSubmit={addWorkout} className="workout-form">
                  <div className="form-group">
                    <label>Workout Type</label>
                    <select 
                      value={newWorkout.type}
                      onChange={(e) => setNewWorkout({...newWorkout, type: e.target.value})}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Running">Running</option>
                      <option value="Weight Training">Weight Training</option>
                      <option value="Yoga">Yoga</option>
                      <option value="Cycling">Cycling</option>
                      <option value="Swimming">Swimming</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Duration (minutes)</label>
                    <input 
                      type="number" 
                      value={newWorkout.duration}
                      onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Calories Burned</label>
                    <input 
                      type="number" 
                      value={newWorkout.calories}
                      onChange={(e) => setNewWorkout({...newWorkout, calories: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      value={newWorkout.date}
                      onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="submit-btn">Add Workout</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="tab-content">
              <div className="tab-header">
                <h1>Fitness Goals</h1>
                <button 
                  className="add-btn"
                  onClick={() => document.getElementById('goal-form').scrollIntoView()}
                >
                  <i className="fas fa-plus"></i> Set New Goal
                </button>
              </div>

              <div className="goals-container">
                <div className="active-goals">
                  <h2>Active Goals</h2>
                  {goals.filter(g => !g.completed).map(goal => (
                    <div key={goal.id} className="goal-card">
                      <div className="goal-progress">
                        <h3>{goal.type.toUpperCase()} Goal</h3>
                        <p>Target: {goal.target} | Current: {goal.current}</p>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {Math.round((goal.current / goal.target) * 100)}% Complete
                        </span>
                      </div>
                      <div className="goal-actions">
                        <button 
                          className="complete-btn"
                          onClick={() => completeGoal(goal.id)}
                        >
                          Mark Complete
                        </button>
                        <span className="deadline">Due: {goal.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="completed-goals">
                  <h2>Completed Goals</h2>
                  {goals.filter(g => g.completed).map(goal => (
                    <div key={goal.id} className="goal-card completed">
                      <div className="goal-progress">
                        <h3>{goal.type.toUpperCase()} Goal ✓</h3>
                        <p>Target: {goal.target} achieved!</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="goal-form" className="form-section">
                <h2>Set New Goal</h2>
                <form onSubmit={addGoal} className="goal-form">
                  <div className="form-group">
                    <label>Goal Type</label>
                    <select 
                      value={newGoal.type}
                      onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                      required
                    >
                      <option value="weight">Weight Loss</option>
                      <option value="running">Running Distance</option>
                      <option value="strength">Strength Training</option>
                      <option value="flexibility">Flexibility</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Target Value</label>
                    <input 
                      type="number" 
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                      placeholder="e.g., 70 for weight, 5 for running distance"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Deadline</label>
                    <input 
                      type="date" 
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="submit-btn">Set Goal</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="tab-content">
              <h1>Progress Tracking</h1>
              
              <div className="progress-stats">
                <div className="progress-card">
                  <h3>Weight Progress</h3>
                  <div className="progress-circle">
                    <div className="circle">
                      <span className="progress-value">{progress.weight}kg</span>
                    </div>
                  </div>
                  <div className="progress-input">
                    <label>Update Weight:</label>
                    <input 
                      type="number" 
                      placeholder="Enter current weight"
                      onChange={(e) => setProgress({...progress, weight: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="progress-card">
                  <h3>Body Fat Percentage</h3>
                  <div className="progress-circle">
                    <div className="circle">
                      <span className="progress-value">{progress.bodyFat}%</span>
                    </div>
                  </div>
                  <div className="progress-input">
                    <label>Update Body Fat:</label>
                    <input 
                      type="number" 
                      placeholder="Enter body fat %"
                      onChange={(e) => setProgress({...progress, bodyFat: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="progress-card">
                  <h3>Muscle Mass</h3>
                  <div className="progress-circle">
                    <div className="circle">
                      <span className="progress-value">{progress.muscleMass}kg</span>
                    </div>
                  </div>
                  <div className="progress-input">
                    <label>Update Muscle Mass:</label>
                    <input 
                      type="number" 
                      placeholder="Enter muscle mass"
                      onChange={(e) => setProgress({...progress, muscleMass: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <div className="progress-chart">
                <h2>Weekly Workout Summary</h2>
                <div className="chart-container">
                  <div className="chart-bar">
                    <div className="bar" style={{ height: '80%' }}>
                      <span>Mon</span>
                    </div>
                    <div className="bar" style={{ height: '60%' }}>
                      <span>Tue</span>
                    </div>
                    <div className="bar" style={{ height: '90%' }}>
                      <span>Wed</span>
                    </div>
                    <div className="bar" style={{ height: '70%' }}>
                      <span>Thu</span>
                    </div>
                    <div className="bar" style={{ height: '85%' }}>
                      <span>Fri</span>
                    </div>
                    <div className="bar" style={{ height: '50%' }}>
                      <span>Sat</span>
                    </div>
                    <div className="bar" style={{ height: '30%' }}>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Homepage;