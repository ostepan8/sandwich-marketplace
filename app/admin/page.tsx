
"use client"
import { subtitle, title } from "@/components/primitives";
import { useEffect, useState } from "react";
import { Card, CardBody, Input, Button, Tab, Tabs, Progress } from "@nextui-org/react";
import { siteConfig } from "@/config/site";
import IngredientScreen from "@/components/ingredient-screen";
import { useAuth } from "@/context/AuthContext";
import { Ingredient, MenuItem } from "@/constants/types";
import MenuScreen from "@/components/menu-screen";

export default function AdminPage() {

    const { signin, authenticated, loading } = useAuth()
    const [fetchingData, setFetchingData] = useState(true)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [ingredientData, setIngredientData] = useState<Ingredient[]>([])
    const [menuData, setMenuData] = useState<MenuItem[]>([])
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
        setFetchingData(false)


        try {
            const response = await fetch(siteConfig.api + "get-menu-and-ingredient-data", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMenuData(data.menuData)
                setIngredientData(data.ingredientData)

            } else {
                throw new Error()
            }
        } catch (error) {
            console.log(error)
            setErrorMessage("There was an error, please try again");
        } finally {
            setFetchingData(true)

        }


    }
    const handleLogin = async () => {
        if (!username || !password) {
            setErrorMessage("Please enter both username and password.");
            return;
        }

        try {
            const response = await fetch(siteConfig.api + "admin-sign-in", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                signin(data.token)
                setErrorMessage("");
            } else {
                setErrorMessage('Invalid username or password.');
            }
        } catch (error) {
            setErrorMessage("There was an error, please try again");
        }
    };
    if (loading) return <div className="h-screen w-full ">
        <h1 className={title()}>Loading...</h1>
        <div className="my-32">
            <Progress isIndeterminate />
        </div>


    </div>;
    if (!authenticated) return (
        <div className="flex-1 flex-col flex justify-center items-center ">
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
        <div className="flex w-full flex-col">
            <div className="mb-10">
                <h1 className={title()}>Hey there!</h1>
            </div>
            <Tabs size="lg" aria-label="Options">
                <Tab key="photos" title="Orders">
                    <Card>
                        <CardBody>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </CardBody>
                    </Card>
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
