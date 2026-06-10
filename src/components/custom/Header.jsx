import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import DarkModeToggle from "./DarkModeToggle";
const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    console.log(user);
  }, []);
  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp.data);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => GetUserProfile(tokenResponse),
    onError: (error) => console.log(error),
  });
  return (
    <header className="flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4 shadow-md bg-white dark:bg-gray-900 dark:shadow-gray-800">
      <a href="/" className="shrink-0">
        <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          RoamCraft
        </span>
      </a>
      <div className="flex items-center gap-x-2 sm:gap-x-3">
        <DarkModeToggle />
        {user ? (
          <>
            <a href="/my-trip">
              <Button variant="outline" className="rounded-full">
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" src={user?.picture} />
              </PopoverTrigger>
              <PopoverContent>
                <Button
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="rounded-2xl border-2 p-2 cursor-pointer"
                >
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign in</Button>
        )}
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold">
                  <span className="text-blue-500">Roam</span><span className="text-purple-600">Craft</span>
                </span>
                <span>Sign in with Google Authentication securely</span>
                <Button onClick={login} className="w-full mt-5">
                  Sign in with Google
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
