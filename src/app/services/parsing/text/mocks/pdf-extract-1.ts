import { ParseData } from '../parse-data';
import { Grid } from 'src/app/model/puzzle-model/grid';

const rawData = `
CROSSWORD
No. 15,462 Set by MONK

 JOTTER PAD
ACROSS
  1 John, for one, a powerless 
former president
  5 Butts or tails? (3-4)
  9 It expanded into hate mail 
with virtue – oddly perverse 
(7,8)
10 Profits from paper when 
leader is cut (5)
11 Drunken old coves keeping 
too much aside (5,4)
12 It will disappoint very little 
2 wife in large chair (5,4)
14 Fibre glass one broke – that’s 
no good (5)
15 Tired bishop’s obstinate and 
obsessive (5)
16 Southern critters chewed 
hampers (9)
18 Ligature getting caught 
damaged part of sight (9)
21 Call up first lady to accept fine 
(5)
22 Pets commonly on lead 
caught in sheet (4,4,3,4)
23 One teasing old queen, 
2 perhaps, about obesity in a 
heartless manner (7)
24 After not much time, noble 
French city joined by 
commoner? (5,2)
DOWN
  1 Bond – finish off dodgy agent 
(7)
  2 Operation tails one having left 
estate (15)
  3 Second fish stabbed with hard 
stiletto (5,4)
  4 Disengaged, to some extent, 
about girl
  5 Simple performances, not 
duties made complex (9)
  6 Stick with barrel of Irish stew 
(5)
  7 Study nervous matter when 
astride potty (15)
  8 In a way, schoolgirl’s quick in 
Germany (7)
13 Whereon plucky action occurs 
in one’s mind (3,6)
14 More certain to secure split 
yield (9)
15 Ask for brief pointer about 
god! (7)
17 Small offensive boy in hat (7)
19 Restless and malicious, 
blowing cover (5)
20 Regularly serve Audrey’s duck 
(5)


Solution 15,461`;

const gridData = {
    "properties": {
      "style": "standard",
      "size": {
        "across": 15,
        "down": 15
      }
    },
    "cells": [
      {
        "id": "676",
        "x": 0,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "677",
        "x": 0,
        "y": 1,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "678",
        "x": 0,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "679",
        "x": 0,
        "y": 3,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "680",
        "x": 0,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "681",
        "x": 0,
        "y": 5,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "682",
        "x": 0,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "683",
        "x": 0,
        "y": 7,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "684",
        "x": 0,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "685",
        "x": 0,
        "y": 9,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "686",
        "x": 0,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "687",
        "x": 0,
        "y": 11,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "688",
        "x": 0,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "689",
        "x": 0,
        "y": 13,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "690",
        "x": 0,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "691",
        "x": 1,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "692",
        "x": 1,
        "y": 1,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "693",
        "x": 1,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "694",
        "x": 1,
        "y": 3,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "695",
        "x": 1,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "696",
        "x": 1,
        "y": 5,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "697",
        "x": 1,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "698",
        "x": 1,
        "y": 7,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "699",
        "x": 1,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "700",
        "x": 1,
        "y": 9,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "701",
        "x": 1,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "702",
        "x": 1,
        "y": 11,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "703",
        "x": 1,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "704",
        "x": 1,
        "y": 13,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "705",
        "x": 1,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "706",
        "x": 2,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "707",
        "x": 2,
        "y": 1,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "708",
        "x": 2,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "709",
        "x": 2,
        "y": 3,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "710",
        "x": 2,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "711",
        "x": 2,
        "y": 5,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "712",
        "x": 2,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "713",
        "x": 2,
        "y": 7,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "714",
        "x": 2,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "715",
        "x": 2,
        "y": 9,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "716",
        "x": 2,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "717",
        "x": 2,
        "y": 11,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "718",
        "x": 2,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "719",
        "x": 2,
        "y": 13,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "720",
        "x": 2,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "721",
        "x": 3,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "722",
        "x": 3,
        "y": 1,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "723",
        "x": 3,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "724",
        "x": 3,
        "y": 3,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "725",
        "x": 3,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "726",
        "x": 3,
        "y": 5,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "727",
        "x": 3,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "728",
        "x": 3,
        "y": 7,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "729",
        "x": 3,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "730",
        "x": 3,
        "y": 9,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "731",
        "x": 3,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "732",
        "x": 3,
        "y": 11,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "733",
        "x": 3,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "734",
        "x": 3,
        "y": 13,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "735",
        "x": 3,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "736",
        "x": 4,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "737",
        "x": 4,
        "y": 1,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "738",
        "x": 4,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "739",
        "x": 4,
        "y": 3,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "740",
        "x": 4,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "741",
        "x": 4,
        "y": 5,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "742",
        "x": 4,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "743",
        "x": 4,
        "y": 7,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "744",
        "x": 4,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "745",
        "x": 4,
        "y": 9,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "746",
        "x": 4,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "747",
        "x": 4,
        "y": 11,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "748",
        "x": 4,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "749",
        "x": 4,
        "y": 13,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "750",
        "x": 4,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "751",
        "x": 5,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "752",
        "x": 5,
        "y": 1,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "753",
        "x": 5,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "754",
        "x": 5,
        "y": 3,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "755",
        "x": 5,
        "y": 4,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "756",
        "x": 5,
        "y": 5,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "757",
        "x": 5,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "758",
        "x": 5,
        "y": 7,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "759",
        "x": 5,
        "y": 8,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "760",
        "x": 5,
        "y": 9,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "761",
        "x": 5,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "762",
        "x": 5,
        "y": 11,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "763",
        "x": 5,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "764",
        "x": 5,
        "y": 13,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "765",
        "x": 5,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "766",
        "x": 6,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "767",
        "x": 6,
        "y": 1,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "768",
        "x": 6,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "769",
        "x": 6,
        "y": 3,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "770",
        "x": 6,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "771",
        "x": 6,
        "y": 5,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "772",
        "x": 6,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "773",
        "x": 6,
        "y": 7,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "774",
        "x": 6,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "775",
        "x": 6,
        "y": 9,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "776",
        "x": 6,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "777",
        "x": 6,
        "y": 11,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "778",
        "x": 6,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "779",
        "x": 6,
        "y": 13,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "780",
        "x": 6,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "781",
        "x": 7,
        "y": 0,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "782",
        "x": 7,
        "y": 1,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "783",
        "x": 7,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "784",
        "x": 7,
        "y": 3,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "785",
        "x": 7,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "786",
        "x": 7,
        "y": 5,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "787",
        "x": 7,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "788",
        "x": 7,
        "y": 7,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "789",
        "x": 7,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "790",
        "x": 7,
        "y": 9,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "791",
        "x": 7,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "792",
        "x": 7,
        "y": 11,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "793",
        "x": 7,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "794",
        "x": 7,
        "y": 13,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "795",
        "x": 7,
        "y": 14,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "796",
        "x": 8,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "797",
        "x": 8,
        "y": 1,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "798",
        "x": 8,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "799",
        "x": 8,
        "y": 3,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "800",
        "x": 8,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "801",
        "x": 8,
        "y": 5,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "802",
        "x": 8,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "803",
        "x": 8,
        "y": 7,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "804",
        "x": 8,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "805",
        "x": 8,
        "y": 9,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "806",
        "x": 8,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "807",
        "x": 8,
        "y": 11,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "808",
        "x": 8,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "809",
        "x": 8,
        "y": 13,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "810",
        "x": 8,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "811",
        "x": 9,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "812",
        "x": 9,
        "y": 1,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "813",
        "x": 9,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "814",
        "x": 9,
        "y": 3,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "815",
        "x": 9,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "816",
        "x": 9,
        "y": 5,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "817",
        "x": 9,
        "y": 6,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "818",
        "x": 9,
        "y": 7,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "819",
        "x": 9,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "820",
        "x": 9,
        "y": 9,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "821",
        "x": 9,
        "y": 10,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "822",
        "x": 9,
        "y": 11,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "823",
        "x": 9,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "824",
        "x": 9,
        "y": 13,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "825",
        "x": 9,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "826",
        "x": 10,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "827",
        "x": 10,
        "y": 1,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "828",
        "x": 10,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "829",
        "x": 10,
        "y": 3,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "830",
        "x": 10,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "831",
        "x": 10,
        "y": 5,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "832",
        "x": 10,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "833",
        "x": 10,
        "y": 7,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "834",
        "x": 10,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "835",
        "x": 10,
        "y": 9,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "836",
        "x": 10,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "837",
        "x": 10,
        "y": 11,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "838",
        "x": 10,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "839",
        "x": 10,
        "y": 13,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "840",
        "x": 10,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "841",
        "x": 11,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "842",
        "x": 11,
        "y": 1,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "843",
        "x": 11,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "844",
        "x": 11,
        "y": 3,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "845",
        "x": 11,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "846",
        "x": 11,
        "y": 5,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "847",
        "x": 11,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "848",
        "x": 11,
        "y": 7,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "849",
        "x": 11,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "850",
        "x": 11,
        "y": 9,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "851",
        "x": 11,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "852",
        "x": 11,
        "y": 11,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "853",
        "x": 11,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "854",
        "x": 11,
        "y": 13,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "855",
        "x": 11,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "856",
        "x": 12,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "857",
        "x": 12,
        "y": 1,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "858",
        "x": 12,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "859",
        "x": 12,
        "y": 3,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "860",
        "x": 12,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "861",
        "x": 12,
        "y": 5,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "862",
        "x": 12,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "863",
        "x": 12,
        "y": 7,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "864",
        "x": 12,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "865",
        "x": 12,
        "y": 9,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "866",
        "x": 12,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "867",
        "x": 12,
        "y": 11,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "868",
        "x": 12,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "869",
        "x": 12,
        "y": 13,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "870",
        "x": 12,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "871",
        "x": 13,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "872",
        "x": 13,
        "y": 1,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "873",
        "x": 13,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "874",
        "x": 13,
        "y": 3,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "875",
        "x": 13,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "876",
        "x": 13,
        "y": 5,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "877",
        "x": 13,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "878",
        "x": 13,
        "y": 7,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "879",
        "x": 13,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "880",
        "x": 13,
        "y": 9,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "881",
        "x": 13,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "882",
        "x": 13,
        "y": 11,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "883",
        "x": 13,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "884",
        "x": 13,
        "y": 13,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "885",
        "x": 13,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "886",
        "x": 14,
        "y": 0,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "887",
        "x": 14,
        "y": 1,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "888",
        "x": 14,
        "y": 2,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "889",
        "x": 14,
        "y": 3,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "890",
        "x": 14,
        "y": 4,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "891",
        "x": 14,
        "y": 5,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "892",
        "x": 14,
        "y": 6,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "893",
        "x": 14,
        "y": 7,
        "caption": "",
        "content": "",
        "light": false,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "894",
        "x": 14,
        "y": 8,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "895",
        "x": 14,
        "y": 9,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "896",
        "x": 14,
        "y": 10,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "897",
        "x": 14,
        "y": 11,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "898",
        "x": 14,
        "y": 12,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "899",
        "x": 14,
        "y": 13,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      },
      {
        "id": "900",
        "x": 14,
        "y": 14,
        "caption": "",
        "content": "",
        "light": true,
        "rightBar": false,
        "bottomBar": false,
        "highlight": false
      }
    ]
  };

export const data = {
    gridData,
    rawData,
    clueDataType: "pdf",
}

