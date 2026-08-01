import { CaretLeftIcon } from "@radix-ui/react-icons";
import Form from "../Components/Form";
import { Link } from "react-router";

const Create = () => {

    return(
        <>
            <Link className='backButton' to="/">
                <CaretLeftIcon height="30" width="30"></CaretLeftIcon>
                Back
            </Link>
            <Form o={null}/>
        </>
    )
}

export default Create;