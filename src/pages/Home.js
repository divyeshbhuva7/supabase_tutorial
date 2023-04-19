import { useState } from "react";
import { useEffect } from "react";
import supabase from "../supabaseConfig";
import SmoothieCard from "../components/SmoothieCard";
import { Button, Group, Loader, Text } from "@mantine/core";

const Home = () => {
  const [fetchErr, setFetchErr] = useState(null);
  const [smoothies, setSmoothies] = useState(null);

  const [orderBy, setOrderBy] = useState("created_at");
  const [ascending, setAscending] = useState(true);

  const handleDelete = (id) => {
    setSmoothies((prevSmoothies) => {
      return prevSmoothies.filter((smth) => smth.id !== id);
    });
  };

  useEffect(() => {
    const fetchsmoothies = async () => {
      try {
        const supabaseData = await supabase
          .from("smoothies")
          .select()
          .order(orderBy, { ascending: ascending });

        if (supabaseData.error === null) {
          setTimeout(() => {}, 500);
          setSmoothies(supabaseData.data);
          setFetchErr(null);
        } else {
          setFetchErr("Couldn't find smoothies...!!");
          setSmoothies(null);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchsmoothies();
  }, [orderBy, ascending]);

  return (
    <div className="page home">
      {fetchErr && smoothies === null ? <p>{fetchErr}</p> : null}
      {!smoothies ? <Loader color="teal" variant="bars" /> : null}
      {smoothies && (
        <div className="smoothies">
          <div>
            <div>
              <Group className="order-by" mb={8} mt={5}>
                <Text>Order by :</Text>
                <Button
                  className="btn"
                  onClick={() => {
                    setOrderBy("created_at");
                    {
                      ascending ? setAscending(false) : setAscending(true);
                    }
                  }}
                >
                  {ascending ? "Newest First" : "Oldest First"}
                </Button>
                <Button
                  className="btn"
                  onClick={() => {
                    setOrderBy("title");
                    {
                      ascending ? setAscending(false) : setAscending(true);
                    }
                  }}
                >
                  Title
                </Button>
                <Button
                  className="btn"
                  onClick={() => {
                    setOrderBy("rating");
                    {
                      ascending ? setAscending(false) : setAscending(true);
                    }
                  }}
                >
                  Rating
                </Button>
              </Group>
            </div>
            <div className="smoothie-grid">
              {smoothies.map((smoothie) => (
                <SmoothieCard
                  className="smoothie-card"
                  key={smoothie.id}
                  smoothie={smoothie}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
