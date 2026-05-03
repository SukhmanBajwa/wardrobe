# Wardrobe Application [To be named soon]

## What is wardrobe:
    Wardrobe is a database of your clothes and accesories you own. It shown all inventory in glace. With use of ML and LLM it give you recommendations for matching pairs of other clothes and accesories. This application will help users to keep all inventory in track and get styling recommendations. 

## Users
    There can be multiple users signed in at a time. Switch between users quickly to get personal inventory and suggestions. User can use Oauth or usersname and password to sign in.

## Core features
    - Inventory view like a gallery or shopping site with Item name, descriptions, category and tags.
    - Get recommendations, by opening up an item from given list.
    - Search using name, tags, and description. 
    - Multiple user Signin that makes switching profiles easy to get to their inventory view. 
    - Tags, will be ML generated such as color, pattern, type, etc (to be decided) or user decided, both listed and store sapperately.
    - Share results via link that opens a public view for that particular recommendation. 
    - Save recommendations

## Goals for V1
    Have all core features working. Apart from ML model. V1 can use Online AI API

## User story
    User should be able to sign in with multiple accounts. Each profile should have its own inventory and recommendations. 
    User should be able to search using tags, name and description. 
    User can open up an item from inventory and there should be recommendations to pair that item with.
    User can save those recommendations.
    User should be able to upload new pictures with Name, Description, category and custom tags.

## Out of scope for V1
    - Trained ML model (using Claude API instead)
    - Social features (following other users, liking outfits)
    - E-commerce / buy links
    - Mobile app (web only for V1)

## Multi-account behaviour
    - Multiple accounts can be signed into the same browser simultaneously
    - Switching accounts does not require re-authentication
    - Each account maintains independent session tokens
    - Active account is persisted across page refreshes


