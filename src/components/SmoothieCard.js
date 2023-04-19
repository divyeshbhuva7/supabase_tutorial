import { Link } from "react-router-dom";
import supabase from "../supabaseConfig";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Paper, Rating } from "@mantine/core";

const SmoothieCard = ({ smoothie, onDelete }) => {
  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("smoothies")
      .delete()
      .eq("id", smoothie.id)
      .select();

    if (error) {
      console.log(error);
    }
    if (data) {
      // console.log(data);
      onDelete(smoothie.id);
    }
  };

  return (
    <div className="smoothie-card">
      <div className="descAndButton">
        <div>
          <h3 className="smoothie-title">{smoothie.title}</h3>
          <p className="smoothie-description">{smoothie.method}</p>
        </div>
        <div className="buttons">
          <Paper
            className="modify-btn"
            component={Link}
            varient="link"
            to={`/${smoothie.id}`}
          >
            <EditIcon className="edit-icon" />
          </Paper>
          <Paper className="modify-btn">
            <DeleteIcon className="delete-icon" onClick={handleDelete} />
          </Paper>
        </div>
      </div>

      <div className="rating">
        <Rating fractions={2} value={smoothie.rating} readOnly />
      </div>
    </div>
  );
};

export default SmoothieCard;
