{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE OverloadedStrings #-}

module Spoticka.User where

import Prelude hiding (id)
import Data.Aeson
import Data.Aeson.TH
import Data.Text hiding (replace)

import Database.RethinkDB

-- this means I'm not thinking of my objects correctly
-- Users always have an id, but a submitted user doesn't have those fields
-- This is SO lame.
data User = User {
    id :: Maybe Text,
    email :: Text,
    fullName :: Text,
    avatarUrl :: Text
} deriving(Show)

$(deriveJSON defaultOptions ''User)

userAttributes :: User -> [Attribute]
userAttributes u = ["email" := email u, "fullName" := fullName u, "avatarUrl" := avatarUrl u]

idAttribute :: User -> [Attribute]
idAttribute u =
    case id u of Nothing -> []
                 Just i  -> ["id" := i]

initUsers :: ReQL
initUsers = undefined
-- initUsers = tableCreate (table "users") def

usersTable :: Table
usersTable = table "users"

usersInsert :: User -> ReQL
usersInsert u = usersTable # insert (obj (userAttributes u))

--usersReplace :: User -> ReQL
--usersReplace userId user = replace # (userById userId) (userAttributes user)

--userById :: Text -> ReQL
--userById userId = get usersTable userId

-- can I make these more useful somehow?
-- not the mapping. I want to save it WITHOUT the id field
