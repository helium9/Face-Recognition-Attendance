import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function StagingArea({ data }) {
  return (
    <Card className="rounded-md bg-zinc-800">
      <CardBody className="flex flex-col gap-2 sm:gap-3">
        {data.map((item, index) => (
          <div key={index} className="flex flex-row gap-2 items-center">
            <p className="w-48 text-sm">{item.name}</p>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

const FileUploader = ({ setPayload, roll }) => {
  const fileUploader = useRef();

  const handleFileChange = (e) => {
    setPayload((prev) => ({
      ...prev,
      [roll]: { file: e.target.files[0], name: e.target.files[0].name },
    }));
  };

  return (
    <>
      <input
        accept=".png, .jpg, .jpeg"
        hidden
        type="file"
        ref={fileUploader}
        onChange={handleFileChange}
        required
      />
      <Button
        onPress={() => fileUploader.current.click()}
        className="bg-zinc-700 text-zinc-100 font-medium w-24"
        radius="sm"
        size="md"
      >
        Add files
      </Button>
    </>
  );
};

export default function Config() {
  const [addStudent, setAddStudent] = useState(["", ""]);
  const [studentData, setStudentData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const location = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  console.log(location.state);

  function handleAddStudent(e) {
    e.preventDefault();
    console.log(addStudent);
    axios
      .post(
        "http://localhost:8000/ConfigAddStudent",
        { data: addStudent },
        { params: { user: "user1", classId: location.state.id } }
      )
      .then((res) => setStudentData(res.data));
  }

  useEffect(() => {
    // console.log(location.state);
    axios
      .get("http://localhost:8000/Config", {
        params: { classId: location.state.id, user: "user1" },
      })
      .then((res) => setStudentData(res.data));
  }, []);

  const fileSubmit = () => {
    const formData = new FormData();
    console.log("sel", selectedFiles);
    Object.entries(selectedFiles).forEach(([key, value]) =>
      formData.append("files", { Roll: key, File: value })
    );
    axios.post("http://localhost:8000/Config", {files:formData},{
      params: { classId: location.state.id, user: "user1" },
    });

    formData.forEach((value, key) => console.log(`${key}: ${value}`));
  };

  return (
    <div className="w-screen h-screen flex justify-center p-2">
      <div className="lg:w-3/5 w-screen">
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>Roll Number</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Upload</TableColumn>
          </TableHeader>
          <TableBody>
            {studentData.map((item) => (
              <TableRow key={item[0]}>
                <TableCell>{item[0]}</TableCell>
                {/* Roll */}
                <TableCell>{item[1]}</TableCell>
                <TableCell>
                  {selectedFiles[item[0]] && (
                    <StagingArea data={[{ name: item[0] }]} />
                  )}
                  <span className="w-full flex flex-row justify-end mt-4">
                    {!selectedFiles[item[0]] && (
                      <FileUploader
                        setPayload={setSelectedFiles}
                        roll={item[0]}
                      />
                    )}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          onPress={fileSubmit}
          className="bg-zinc-700 text-zinc-100 font-medium w-24"
          radius="sm"
          size="md"
        >
          Submit All
        </Button>

        <Button
          onPress={() => {
            onOpen();
          }}
          className="bg-zinc-700 text-zinc-100 font-medium w-24"
          radius="sm"
          size="md"
        >
          Add Student
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Student Details
                </ModalHeader>
                <form onSubmit={(e) => handleAddStudent(e)}>
                  <ModalBody>
                    <Input
                      label="Student Name"
                      variant="bordered"
                      value={addStudent[0]}
                      onValueChange={(val) =>
                        setAddStudent(
                          addStudent.map((item, index) =>
                            index === 0 ? val : item
                          )
                        )
                      }
                    />
                    <Input
                      label="Student Roll"
                      variant="bordered"
                      value={addStudent[1]}
                      onValueChange={(val) =>
                        setAddStudent(
                          addStudent.map((item, index) =>
                            index === 1 ? val : item
                          )
                        )
                      }
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose} type="submit">
                      Submit
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
