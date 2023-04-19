import {
  Button,
  Group,
  Input,
  Loader,
  Rating,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useState } from "react";
import supabase from "../supabaseConfig";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const navigate = useNavigate();
  const [smoothieData, setSmoothieData] = useState({
    title: "",
    method: "",
    rating: 0,
  });

  const [titleErr, setTitleErr] = useState("");
  const [methodErr, setMethodErr] = useState("");
  const [ratingErr, setRatingErr] = useState("");

  const [showLoader, setShowLoader] = useState(false);

  const validateForm = () => {
    if (smoothieData.title === "") {
      setTitleErr("Title should not be empty");
    } else if (smoothieData.title.length < 5) {
      setTitleErr("Title must be at least 5 characters");
    } else {
      setTitleErr("");
    }

    if (smoothieData.method === "") {
      setMethodErr("Please enter a method");
    } else if (smoothieData.method.length < 20) {
      setMethodErr("Method must be at least 20 characters long");
    } else {
      setMethodErr("");
    }

    if (smoothieData.rating === 0) {
      setRatingErr("Please enter a rating");
    } else {
      setRatingErr("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    validateForm();

    if (titleErr !== "" && methodErr !== "" && ratingErr !== "") {
      return;
    } else if (
      smoothieData.title.length >= 5 &&
      smoothieData.method.length >= 20 &&
      smoothieData.rating > 0
    ) {
      // console.log(smoothieData);

      const { data, err } = await supabase
        .from("smoothies")
        .insert({
          title: smoothieData.title,
          method: smoothieData.method,
          rating: smoothieData.rating,
        })
        .select();

      if (err) {
        console.log(err);
      }
      if (data) {
        // console.log(data);
        setShowLoader(true);

        setTimeout(() => {
          navigate("/");
          setShowLoader(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="page create">
      {showLoader ? (
        <Loader color="teal" variant="bars" />
      ) : (
        <div className="form">
          <div className="form-title">
            <div>
              <p className="form-header">ADD SMOOTHIE</p>
              <p className="form-header2">ADD SMOOTHIE</p>
            </div>
          </div>
          <form className="create-smoothie-form">
            <TextInput
              label="Title"
              className="input Text"
              withAsterisk
              placeholder="Enter new smoothie name"
              title="Smoothie name"
              value={smoothieData.title}
              error={titleErr}
              onFocus={() => setTitleErr("")}
              onChange={(e) =>
                setSmoothieData({ ...smoothieData, title: e.target.value })
              }
            />
            <Textarea
              label="Method"
              className="input Text"
              withAsterisk
              placeholder="Enter method"
              title="Smoothie method"
              value={smoothieData.method}
              error={methodErr}
              onFocus={() => setMethodErr("")}
              onChange={(e) =>
                setSmoothieData({ ...smoothieData, method: e.target.value })
              }
            />

            <div className="rating">
              <div>
                <Input.Wrapper>Rating :</Input.Wrapper>
                <div>
                  <Rating
                    className="rating-stars"
                    fractions={2}
                    defaultValue={1.5}
                    value={smoothieData.rating}
                    onChange={(e) => {
                      setSmoothieData({ ...smoothieData, rating: e });
                    }}
                  />
                </div>
                <Input.Error className="rating-err">{ratingErr}</Input.Error>
              </div>
            </div>

            <Group position="center" mt="xs">
              <Button className="btn submit-btn" onClick={handleSubmit}>
                CREATE RECIPE
              </Button>
            </Group>
          </form>
        </div>
      )}
    </div>
  );
};

export default Create;
