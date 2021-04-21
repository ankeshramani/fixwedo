import React from "react";

export default function NotFound() {
  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userDetails");
    window.location = "/";

  }
  return (
    <React.Fragment>
      <div className="notfound" id="wrapper" style={{ aligh: "center", display: "inline-block" }}>
        <h1>Oops page not found.</h1>
        <div className="colleague-btn">
          <a className="colleague" onClick={() => logout()}>Home</a>
        </div>
      </div>
    </React.Fragment >
  );
}
