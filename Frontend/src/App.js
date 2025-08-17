import React from "react";
import Jobs from "./components/Jobs";
import Users from "./components/Users";
import Applications from "./components/Applications";

function App() {
  return (
    <div className="App">
      <h1>Job Portal</h1>
      <Users />
      <Jobs />
      <Applications />
    </div>
  );
}

export default App;
