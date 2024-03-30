
"use client"
import { subtitle, title } from "@/components/primitives";
import { useEffect, useState } from "react";
import { Input, Button, Tab, Tabs, Progress } from "@nextui-org/react";
import IngredientScreen from "@/components/ingredient-screen";
import { useAuth } from "@/context/AuthContext";
import { Ingredient, DatabaseTransaction, MenuItem, GetAllDataToReturn } from "@/constants/types";
import MenuScreen from "@/components/menu-screen";
import { adminLogin } from "../lib/actions/admin.actions";
import { getAllData } from "../lib/actions/transaction.action";
import TransactionScreen from "@/components/transaction-screen";

export default function AdminPage() {

    const { signin, authenticated, loading, signout } = useAuth()
    const [fetchingData, setFetchingData] = useState(true)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [ingredientData, setIngredientData] = useState<Ingredient[]>([])
    const [menuData, setMenuData] = useState<MenuItem[]>([])
    const [transactionData, setTransactionData] = useState<DatabaseTransaction[]>([])
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        fetchMenuDataAndMenuData()
        return () => {
            setFetchingData(true)
            setErrorMessage('')
            setIngredientData([])
            setMenuData([])

        }
    }, [])

    const fetchMenuDataAndMenuData = async () => {
        setFetchingData(true);

        try {
            const { menuData, ingredientData, transactions }: GetAllDataToReturn = await getAllData();
            setTransactionData(transactions)
            console.log(transactions, "transactions")
            setMenuData(menuData);
            setIngredientData(ingredientData);
        } catch (error) {

            console.error(error); // More informative for debugging
            setErrorMessage("There was an error, please try again");
        } finally {
            setFetchingData(false);
        }
    };



    const handleLogin = async () => {
        if (!username || !password) {
            setErrorMessage("Please enter both username and password.");
            return;
        }

        try {
            // Use the adminLogin function directly instead of making an API call
            const result = await adminLogin({ name: username, password });

            if (result && result.status === 'success') {
                signin(result.token); // Make sure signin is defined and correctly handles the token
                setErrorMessage("");
            } else {
                // If adminLogin does not throw but returns falsy or non-success status
                setErrorMessage('Invalid username or password.');
            }
        } catch (error) {
            console.error(error); // Always good to log the actual error for debugging
            setErrorMessage("There was an error, please try again");
        }
    };

    if (loading) return <div className="h-screen w-full p-8">
        <h1 className={title()}>Loading...</h1>
        <div className="my-32">
            <Progress isIndeterminate />
        </div>


    </div>;
    if (!authenticated) return (
        <div className="flex-1 flex-col flex justify-center items-center p=8 ">
            <h1 className={title()}>Admin Sign In</h1>
            <div className="w-[50%] justify-center items-center">
                <h1 className={subtitle()}>Username</h1>
                <Input size="lg" value={username} onChange={(e) => setUsername(e.target.value)} />
                <h1 className={subtitle()}>Password</h1>
                <Input size="lg" value={password} onChange={(e) => setPassword(e.target.value)} type={"password"} />
                {errorMessage && <h1 className={subtitle() + " text-red-600 text-center"}>{errorMessage}</h1>}
                <div className="w-full justify-center flex">
                    <Button size={"lg"} onPress={handleLogin} className="my-6 ">
                        Login
                    </Button>
                </div>

            </div>
        </div>
    );
    if (authenticated) return (
        <div className="w-full flex flex-col p-8">
            <div className="mb-10">
                <h1 className={title()}>Hey there!</h1>
            </div>
            <Tabs size="lg" aria-label="Options">
                <Tab key="photos" title="Orders">
                    <TransactionScreen data={transactionData}></TransactionScreen>
                </Tab>
                <Tab key="menu" title="Menu Customizer" className="py-6" >
                    <MenuScreen data={menuData} setMenuData={setMenuData} ingredientData={ingredientData} />
                </Tab>
                <Tab key="ingredient" title="Ingredient Customizer" className="py-6">
                    <IngredientScreen data={ingredientData} setIngredientData={setIngredientData} />
                </Tab>
            </Tabs>
        </div>
    )
}
