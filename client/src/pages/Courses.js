import { motion } from "framer-motion";
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
import { useState } from "react";

function CourseCard({ code, color, batch }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const currentDate = new Date();
  const [date, setDate] = useState([
    currentDate.getDate(),
    currentDate.getMonth() + 1,
    currentDate.getFullYear(),
  ]);
  const [typeModal, setTypeModal] = useState("take");
  const handleModalSubmit = async (type, event) => {
    event.preventDefault();
    console.log(type, date);
  };
  const ModalComponent = (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Enter Date
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
            onOpen();
            setTypeModal("take");
          }}
        >
          Take
        </Button>
        <Button
          className="rounded-none bg-zinc-900"
          onPress={() => {
            onOpen();
            setTypeModal("view");
          }}
        >
          View
        </Button>
        <Button className="rounded-none bg-zinc-900">Config</Button>
        {ModalComponent}
      </ButtonGroup>
    </Card>
  );
}
export default function Courses() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="font-medium">Courses:</div>
      <CourseCard code="CS201" batch="B.Tech 2022" color="blue" />
      <CourseCard code="CS203" batch="B.Tech 2022" color="rose" />
      <CourseCard code="CS207" batch="B.Tech 2022" color="emerald" />
    </div>
  );
}
