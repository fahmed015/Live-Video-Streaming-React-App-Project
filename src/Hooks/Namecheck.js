import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

function Namecheck() {
  const Name = useSelector((state) => state.name);

  return !!Name ? <Outlet /> : <Navigate to="/" />;
}
export default Namecheck;
