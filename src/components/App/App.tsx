import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Table } from "Components";

export function App() {
  return (
    <div className="App">
      <Table listName={"Submitted Projects"} />
    </div>
  );
}

export default App;
