import { BarLoader } from "react-spinners";

const Loader = () => {
    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 2001,
            }}
        >
            <BarLoader color="blue" width={"100%"} height={4} />
        </div>
    );
};

export default Loader;
