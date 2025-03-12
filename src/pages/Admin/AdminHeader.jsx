import React from "react";
import styles from "../../components/header.module.css";
import imagePath from "../../assets/school_logo.png";
import profilePath from "../../assets/profile-image.png";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const loggedout = () => {
    navigate("/admin-login");
    localStorage.clear();
  };
  return (
    <React.Fragment>
      <div className={styles.headerDiv}>
        <div>
          <img src={imagePath} style={{ width: "50px", height: "auto" }} />
        </div>

        <div
          style={{
            textAlign: "center",
            marginLeft: "10px",
            borderLeft: "2px solid gray",
            paddingLeft: "10px",
            color: "white",
          }}
        >
          <h6>
            ONEST as SAAS - Giving Providers an easy gateway to publish to the
            network
          </h6>
        </div>
        <div className={styles.menuDiv}>
          <div className={styles.profile}>
            {/* <img
              src={profilePath}
              alt="Girl in a jacket"
              width="20"
              height="20"
            /> */}
            <button className={styles.logoutButton} onClick={loggedout}>
              Log out
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Header;
