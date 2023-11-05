import React, { useState } from "react";
import { ButtonClick } from "../../components";
import { useParams } from "react-router-dom";
import { apiResetPassword } from "../../apis/user";
import Swal from "sweetalert2";
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const handleResetPassword = async () => {
    const response = await apiResetPassword({ password, token });
    if (response.success) {
      Swal.fire("Congratulations", response.mes, "success");
    } else {
      Swal.fire("Opp!", response.mes, "error");
    }
  };
  return (
    <div
      className={`absolute top-0 bottom-0 right-0 left-0 bg-white animate-slide-right flex justify-center z-30 pt-8 `}
    >
      <div className="flex flex-col gap-4">
        <label htmlFor="password">Enter your new password: </label>
        <input
          type="password"
          className="w-[500px] border-b outline-none placeholder:text-sm"
          id="password"
          placeholder="Type your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className=" w-full flex justify-center gap-8">
          <ButtonClick name="Submit" handleClick={handleResetPassword} />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
