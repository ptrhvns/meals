import Navbar from "../components/Navbar";
import RequireAuthn from "../components/RequireAuthn";

export default function Dashboard() {
  return (
    <RequireAuthn>
      <Navbar />
      <div>Dashboard</div>
    </RequireAuthn>
  ); // TODO implement component
}
