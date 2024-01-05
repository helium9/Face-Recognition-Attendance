import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup } from "@nextui-org/react";
import {
  Card,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import axios from "axios";

function CourseCard({ code, color, batch, id }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const currentDate = new Date();
  const navigate = useNavigate();
  const [date, setDate] = useState([
    currentDate.getDate(),
    currentDate.getMonth() + 1,
    currentDate.getFullYear(),
  ]);
  const [typeModal, setTypeModal] = useState("take");
  const handleModalSubmit = async (type, event) => {
    event.preventDefault();
    // console.log(type, date);
    if(type==="take"){
      navigate("/takeattendance", { state: { id: id, date:`${String(date[0])}/${String(date[1])}/${String(date[2])}` } })
    }
    else if(type==="view"){
      navigate("/view", { state: { id: id, date:`${String(date[0])}/${String(date[1])}/${String(date[2])}` } })
    }
  };
  const ModalComponent = (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Enter Date for {(typeModal==="view")?("viewing"):("taking attendance")}
            </ModalHeader>
            <form onSubmit={(event) => handleModalSubmit(typeModal, event)}>
              <ModalBody className="flex flex-row">
                <Input
                  type="number"
                  label="Day"
                  variant="bordered"
                  value={date[0]}
                  className="max-w-xs"
                  onValueChange={(val) =>
                    setDate(
                      date.map((item, index) =>
                        index === 0 ? Number(val) : item
                      )
                    )
                  }
                />
                <Input
                  type="number"
                  label="Month"
                  variant="bordered"
                  value={date[1]}
                  className="max-w-xs"
                  onValueChange={(val) =>
                    setDate(
                      date.map((item, index) =>
                        index === 1 ? Number(val) : item
                      )
                    )
                  }
                />
                <Input
                  type="number"
                  label="Year"
                  variant="bordered"
                  value={date[2]}
                  className="max-w-xs"
                  onValueChange={(val) =>
                    setDate(
                      date.map((item, index) =>
                        index === 2 ? Number(val) : item
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
  );
  return (
    <Card className="max-w-[500px]">
      <CardHeader className="flex gap-3">
        <motion.div
          className={`bg-${color}-700 w-5 h-5 ml-1 rounded-full`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <div className="flex flex-col">
          <p className="text-md">{code}</p>
          <p className="text-small text-default-500">{batch}</p>
        </div>
      </CardHeader>
      <Divider />
      <ButtonGroup fullWidth={true} className="rounded-none bg-zinc-900">
        <Button
          className="rounded-none bg-zinc-900"
          onPress={() => {
            setTypeModal("take");
            onOpen();
          }}
        >
          Take
        </Button>
        <Button
          className="rounded-none bg-zinc-900"
          onPress={() => {
            setTypeModal("view");
            onOpen();
          }}
        >
          View
        </Button>
        <Button
          className="rounded-none bg-zinc-900"
          onPress={() => navigate("/config", { state: { id: id } })}
        >
          Config
        </Button>
        {ModalComponent}
      </ButtonGroup>
    </Card>
  );
}
export default function Courses() {
  const [courses, setCourses] = useState([]);
  function getClasses() {
    axios
      .get("http://localhost:8000/Class", { params: { user: "user1" } })
      .then((res) => {
        // console.log("inside function", res.data);
        setCourses(res.data);
      });
  }

  useEffect(()=>{
    getClasses();
  }, []);

  // console.log("Courses:", courses);
  const [addCourseData, setAddCourseData] = useState(["", ""]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  function handleAddCourse(){
    console.log(addCourseData);
    axios
      .post("http://localhost:8000/Class", {data: addCourseData}, { params: { user: "user1" } }).then(console.log("Successfully, uploaded."));
  }
  return (
    <div className="w-screen flex justify-center">
      <div className="flex flex-col gap-3 p-4 w-96">
        <div className="font-medium">Classes:</div>
        {courses.map((item) => {
          {/* console.log(item); */}
          return (
            <CourseCard
              key={item.id}
              id={item.id}
              code={item.code}
              batch={item.batch}
              color={item.color}
            />
          );
        })}
        <Button
          onPress={() => {
            onOpen();
          }}
          className="bg-zinc-700 text-zinc-100 font-medium w-24"
          radius="sm"
          size="md"
        >
          Add class
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Class Details
                </ModalHeader>
                <form onSubmit={handleAddCourse}>
                <ModalBody>
                  <Input
                    label="Course Name"
                    variant="bordered"
                    value={addCourseData[0]}
                    onValueChange={(val) =>
                      setAddCourseData(
                        addCourseData.map((item, index) =>
                          index === 0 ? val : item
                        )
                      )
                    }
                  />
                  <Input
                    label="Batch Name"
                    variant="bordered"
                    value={addCourseData[1]}
                    onValueChange={(val) =>
                      setAddCourseData(
                        addCourseData.map((item, index) =>
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
