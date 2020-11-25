import React from "react";
import ReactDOM from "react-dom";
import WithRedux from "./with-redux/game";
import WithZustand from "./with-zustand/game";
import "./index.css";

function Samples() {
  return (
    <div className="flex tall">
      <WithRedux />
      <WithZustand />
    </div>
  );
}

ReactDOM.render(<Samples />, document.getElementById("root"));
