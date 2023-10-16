import { Card, CardBody } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/react";
import { ChangeEvent, useRef, useState } from "react";
import axios from "axios";

// const all_present = ["220001004", "220001002", "220001003", "220001004"];
// const all_files = ["file_name1.png", "file_name2.png"];

function StagingArea({ data, name }) {
  return (
    <Card className="rounded-md bg-zinc-800">
      <CardBody className="flex flex-col gap-2 sm:gap-3">
        {data.length === 0 ? (
          <p className="text-sm text-zinc-400">*Add files to display</p>
        ) : (
          data.map((item, index) => (
            <div key={index} className="flex flex-row gap-2 items-center">
              <p className="w-48 text-sm">{item.name}</p>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}

function AllPresent({ data, name }) {
  return (
    <Card className="rounded-md bg-zinc-800">
      <CardBody className="flex flex-col gap-2 sm:gap-3">
        {data.map((item, index) => (
          <div key={index} className="flex flex-row gap-2 items-center">
            <p className="w-48 text-sm">{item}</p>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

export default function HomePage() {
  const fileUploader = useRef();
  const [selectedFile, setSelectedFile] = useState([]);
  const [allPresent, setAllPresent] = useState([]);

  console.log(selectedFile[0])
  function fileSubmit() {
    const formData = new FormData();

    selectedFile.forEach((file) => formData.append("files", file));
    // console.log(formData);
    setAllPresent([]);
    axios
      .post("http://127.0.0.1:8000/uploadfiles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data.present)
        setAllPresent(response.data.present);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  console.log(selectedFile);
  return (
    <>
      <div className="flex w-full justify-center p-4">
        <div className="w-96 flex flex-col gap-4">
          <p className="text-2xl font-bold">Take Attendance</p>
          <div className="flex flex-col gap-2">
            <p className=" font-medium">Uploaded Images:</p>
            <StagingArea data={selectedFile} name="file" />
            <span className="w-full flex flex-row justify-end mt-4 gap-4">
              <Button
                onPress={() => fileUploader.current.click()}
                className="bg-zinc-700 text-zinc-100 font-medium w-24"
                radius="sm"
                size="md"
              >
                Add files
              </Button>
              <Button
                onPress={fileSubmit}
                className="bg-zinc-700 text-zinc-100 font-medium w-24"
                radius="sm"
                size="md"
              >
                Submit
              </Button>
            </span>

            <input
              accept=".png, .jpg, .jpeg"
              //   this doesn't really prevent the user from uploading anyways
              hidden
              type="file"
              ref={fileUploader}
              onChange={(e) =>
                setSelectedFile([...selectedFile, e.target.files[0]])
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className=" font-medium">All present:</p>
            <AllPresent data={allPresent} name="present" />
            <span className="w-full flex flex-row justify-end mt-4 gap-4">
              <Button
                className="bg-zinc-700 text-zinc-100 font-medium w-24"
                radius="sm"
                size="md"
              >
                Export CSV
              </Button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
