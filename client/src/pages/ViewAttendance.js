import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
// const present = [
//   ["chomu 1", "220001002", "present"],
//   ["Chomu2", "220001001", "absent"],
// ];
export default function ViewAttendance() {
  const location = useLocation();
  // console.log(location.state);
  const [present, setPresent] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/view", {
        params: {
          user: "user1",
          classId: location.state.id,
          date: location.state.date,
        },
      })
      .then((res) => setPresent(res.data.present));
  }, []);
  return (
    <div className="w-screen h-screen flex justify-center p-2">
      <div className="lg:w-3/5 w-screen">
        <span>Attendance of {location.state.date}</span>
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>ROLL</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody>
            {present.map((item) => (
              <TableRow key={item[1]}>
                <TableCell>{item[0]}</TableCell>
                <TableCell>{item[1]}</TableCell>
                <TableCell>{item[2]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
