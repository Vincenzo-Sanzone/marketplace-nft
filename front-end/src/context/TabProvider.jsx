import React, { createContext, useContext } from 'react';

const TabContext = createContext({});

export const useTabContext = () => useContext(TabContext);

export const TabProvider = ({ children }) => {
    const [tabChosen, setTabChosen] = React.useState(0);

    return (
        <TabContext.Provider value={{ tabChosen, setTabChosen }}>
            {children}
        </TabContext.Provider>
    );
};
