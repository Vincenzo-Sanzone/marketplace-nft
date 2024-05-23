import React from "react";
import { HeaderComponent } from "../../component/header/Header.component";
import {useTabContext} from "../../context/TabProvider";

export const HeaderContainer = () => {
    const { tabChosen, setTabChosen } = useTabContext();

    const onUpdateValue = (event, newTab) => {
        setTabChosen(newTab);
    };

    return (
        <HeaderComponent value={tabChosen} updateValue={onUpdateValue} />
    );
}
