import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useLocation } from "react-router-dom";
import { useRef, useState } from "react";

const FileUploader = ({ setPayload, Roll}) => {
  const fileUploader = useRef();
  return (
    <>
      <input
        accept=".png, .jpg, .jpeg"
        //   this doesn't really prevent the user from uploading anyways
        hidden
        type="file"
        ref={fileUploader}
        onChange={(e) => {
            console.log("key", Roll);
          setPayload(prev=>(
            {...prev, [Roll]:e.target.files[0]}
          ));
        //   console.log(e.target.files[0]);
        }}
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
  const location = useLocation();
  const [addStudent, setAddStudent] = useState({Name: "", Roll: ""});
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [studentData, setStudentData] = useState([
    { Roll: "220001001", Name: "Chomu" },
    { Roll: "220001002", Name: "Bada Chomu" },
    { Roll: "220001024", Name: "Rust ka choda" },
  ]);
  const [payload, setPayload] = useState({});
  console.log("payload ", payload);
  // console.log(selectedFile);
  // console.log(location.state);
  return (
    <div className="w-screen h-screen flex justify-center p-2">
      <div className="lg:w-3/5 w-screen">
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>Roll</TableColumn>
            <TableColumn>Upload</TableColumn>
          </TableHeader>
          <TableBody>
            {studentData.map((item) => {
              {/* console.log(item.Roll); */}
              return (
                <TableRow key={item.Roll}>
                  <TableCell>{item.Name}</TableCell>
                  <TableCell>{item.Roll}</TableCell>
                  <TableCell>
                    <FileUploader
                      key={item.Roll}
                      Roll={item.Roll}
                      setPayload={setPayload}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="w-full flex justify-end p-3 pr-0">
        <Button
          onPress={() => {
            onOpen();
          }}
          className="bg-zinc-700 text-zinc-100 font-medium w-24"
          radius="sm"
          size="md"
        >
          Add student
        </Button>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Students Details
                </ModalHeader>
                {/* <form onSubmit={(event) => handleModalSubmit(typeModal, event)}> */}
                <ModalBody>
                  <Input
                    label="Student Name"
                    variant="bordered"
                    value={addStudent.Name}
                    onValueChange={(val) =>
                        setAddStudent({...addStudent, Name:val})
                    }
                  />
                  <Input
                    label="Roll"
                    variant="bordered"
                    value={addStudent.Roll}
                    onValueChange={(val) =>
                        setAddStudent({...addStudent, Roll:val})
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
                {/* </form> */}
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
