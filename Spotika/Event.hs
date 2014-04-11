module Spotika.Event where

import Spotika.Badge

data Event = Event {
    id   :: String,
    location :: String,
    time :: String,
    badges :: [Badge]
} deriving(Show)
