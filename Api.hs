{-# LANGUAGE OverloadedStrings #-}


import Web.Scotty
import Data.Monoid (mconcat)
import Network.HTTP.Types (status302, status200, status404, status500)

import Spotika.User
import Spotika.Badge (Badge)
import Spotika.Event (Event)

import Control.Monad.IO.Class (liftIO)

import qualified Database.RethinkDB as R
import qualified Database.RethinkDB.NoClash as RNC
import qualified Data.Aeson as Aeson

main :: IO ()
main = do
    h <- initData
    api h
    return ()

api :: R.RethinkDBHandle -> IO ()
api h = scotty 3000 $ do

    get "/fake" $ do
        json $ fakeUsers

    get "/users" $ do
        users <- liftIO $ (R.run h usersTable :: IO ([User]))
        json $ users

    -- get "/users/:id" $ do
        -- userId <- param "id"
        -- json $

    post "/users" $ do
        liftIO $ R.run' h (usersInsert fakeUserSean)
        status status200
        text "OK"

    get "/:word" $ do
        beam <- param "word"
        html $ mconcat ["<h1>Scotty, ", beam, " me up!</h1>"]


initData :: IO (R.RethinkDBHandle)
initData = do
    putStrLn "Initialize"
    h1 <- R.connect "localhost" 28015 Nothing
    let h = R.use h1 (R.db "spotika")
    return h
