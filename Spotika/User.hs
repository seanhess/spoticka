{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE OverloadedStrings #-}

module Spotika.User where

import Prelude hiding (id)
import Data.Aeson
import Data.Aeson.TH
import Data.Text

import Database.RethinkDB

data User = User {
    id :: Text,
    email :: Text,
    fullName :: Text,
    avatarUrl :: Text
} deriving(Show)

$(deriveJSON defaultOptions ''User)


userToObj :: User -> Database.RethinkDB.Object
userToObj u = obj ["id" := id u, "email" := email u, "fullName" := fullName u, "avatarUrl" := avatarUrl u]


fakeUserSean = User {id="0", fullName="Sean Hess", email="seanhess@gmail.com", avatarUrl="http://google.com"}

fakeUsers :: [User]
fakeUsers = [fakeUserSean]

initUsers :: ReQL
initUsers = undefined
-- initUsers = tableCreate (table "users") def

usersTable :: Table
usersTable = table "users"

usersInsert :: User -> ReQL
usersInsert u = usersTable # insert (userToObj u)
