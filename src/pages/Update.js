import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../supabaseConfig";
import {
  Button,
  Group,
  Input,
  Rating,
  TextInput,
  Textarea,
} from "@mantine/core";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [smoothieData, setSmoothieData] = useState({
    title: "",
    method: "",
    rating: 0,
  });
  const [titleErr, setTitleErr] = useState("");
  const [methodErr, setMethodErr] = useState("");
  const [ratingErr, setRatingErr] = useState("");

  useEffect(() => {
    const fetchSmoothie = async () => {
      const { data, error } = await supabase
        .from("smoothies")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
        navigate("/", { replace: true });
      }
      if (data) {
        setSmoothieData({
          title: data.title,
          method: data.method,
          rating: data.rating,
        });
      }
    };

    fetchSmoothie();
  }, []);

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

      const { data, error } = await supabase
        .from("smoothies")
        .update({
          title: smoothieData.title,
          method: smoothieData.method,
          rating: smoothieData.rating,
        })
        .eq("id", id)
        .select();

      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
        navigate("/");
      }
    }
  };

  return (
    <div className="page update">
      <div className="form">
        <div className="form-title">
          <div>
            <p className="form-header">EDIT SMOOTHIE</p>
            <p className="form-header2">EDIT SMOOTHIE</p>
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
              UPDATE RECIPE
            </Button>
          </Group>
        </form>
      </div>
    </div>
  );
};

export default Update;
