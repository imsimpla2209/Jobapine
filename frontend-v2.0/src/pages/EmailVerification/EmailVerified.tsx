
import verify from "../../assets/svg/verifyEmail.svg";
// import { auth } from "../../firebase";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function EmailVerified() {
  const navigate = useNavigate();
  const userr = {emailVerified: true, displayName: '420 user'};
  // userr.reload().then(() => {
  //   console.log({ emailVerified: userr.emailVerified })
  // })

  useEffect(() => {
  }, [userr]);


  return (
    <div className="text-center" style={{ margin: "67px 0" }}>
      <img src={verify} style={{ width: "150px" }} />
      <h3 className="my-3">Email is verfied successfully</h3>
      <button className="btn bg-jobsicker"
        onClick={() => userr.displayName === "freelancer" ? navigate("/create-profile") : navigate("/post-job")} >
        {userr.displayName === "freelancer" ? "Compelete your profile data" : "Post a job"}
      </button>
      <br />
    </div>
  );
}
