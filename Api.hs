{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ScopedTypeVariables #-}


import Web.Scotty
import Data.Monoid (mconcat)
import Network.HTTP.Types (status302, status200, status400, status404, status500)

import Spoticka.User
import Spoticka.Badge (Badge)
import Spoticka.Event (Event)

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

    let run q = liftIO $ R.run h q
    let run' q = liftIO $ R.run' h q

    get "/users" $ do
        users <- run usersTable
        json $ (users :: [User])

    -- get "/users/:id" $ do
        -- userId <- param "id"
        -- json $

    post "/users" $ decodeBody $ \user -> do
        run' (usersInsert user)
        status status200
        text "OK"

    --put "/users/:id" $ decodeBody $ \user -> do
        --userId <- param "id"
        --run' (usersReplace userId user)
        --status status200
        --text "OK"

    get "/:word" $ do
        beam <- param "word"
        html $ mconcat ["<h1>Scotty, ", beam, " me up!</h1>"]


initData :: IO (R.RethinkDBHandle)
initData = do
    putStrLn "Initialize"
    h1 <- R.connect "localhost" 28015 Nothing
    let h = R.use h1 (R.db "spotika")
    return h

-- parse the body as something, and call "k" with the result
decodeBody :: (Aeson.FromJSON a) => (a -> ActionM ()) -> ActionM ()
decodeBody k = do
    b <- body
    let mo = Aeson.decode b
    case mo of
        Just o -> k o
        Nothing -> do
            status status400
            text $ "Invalid Body JSON"
