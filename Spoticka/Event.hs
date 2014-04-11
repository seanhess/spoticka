module Spoticka.Event where

import Spoticka.Badge

data Event = Event {
    id   :: String,
    location :: String,
    time :: String,
    badges :: [Badge]
} deriving(Show)
