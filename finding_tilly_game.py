#!/usr/bin/env python3
"""
Finding Tilly - A simple adventure game for kids
"""
import random
import time
import os

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def slow_print(text):
    """Print text with a typing effect."""
    for char in text:
        print(char, end='', flush=True)
        time.sleep(0.03)
    print()

class Game:
    def __init__(self):
        self.player_name = ""
        self.tilly_location = ""
        self.current_location = "home"
        self.locations = {
            "home": {
                "description": "You are at home. The sun is shining through the windows.",
                "connections": ["garden", "kitchen", "bedroom"],
                "items": ["map"]
            },
            "garden": {
                "description": "You're in a beautiful garden with colorful flowers.",
                "connections": ["home", "playground"],
                "items": ["shovel"]
            },
            "kitchen": {
                "description": "The kitchen smells like cookies!",
                "connections": ["home", "dining_room"],
                "items": ["cookie"]
            },
            "bedroom": {
                "description": "This is your cozy bedroom with toys scattered around.",
                "connections": ["home", "closet"],
                "items": ["flashlight"]
            },
            "playground": {
                "description": "A fun playground with swings and slides!",
                "connections": ["garden", "treehouse"],
                "items": ["ball"]
            },
            "dining_room": {
                "description": "A large table sits in the middle of this room.",
                "connections": ["kitchen"],
                "items": ["key"]
            },
            "closet": {
                "description": "A small dark closet with clothes hanging up.",
                "connections": ["bedroom"],
                "items": ["hat"]
            },
            "treehouse": {
                "description": "An awesome treehouse high up in a tree!",
                "connections": ["playground"],
                "items": ["telescope"]
            }
        }
        self.inventory = []
        self.hints_used = 0
        self.moves = 0
        
    def start(self):
        clear_screen()
        slow_print("=== FINDING TILLY ===")
        slow_print("Oh no! Tilly is hiding somewhere!")
        self.player_name = input("What's your name, brave explorer? ")
        slow_print(f"Welcome, {self.player_name}! Let's find Tilly!")
        
        # Randomly place Tilly in one of the locations
        possible_locations = list(self.locations.keys())
        self.tilly_location = random.choice(possible_locations)
        
        self.game_loop()
    
    def show_location(self):
        location = self.locations[self.current_location]
        print("\n" + "="*50)
        slow_print(f"You are in the {self.current_location}.")
        slow_print(location["description"])
        
        # Show available paths
        connections = location["connections"]
        slow_print("From here, you can go to: " + ", ".join(connections))
        
        # Show items
        items = location["items"]
        if items:
            slow_print(f"You see: {', '.join(items)}")
        
        # Show inventory
        if self.inventory:
            slow_print(f"Inventory: {', '.join(self.inventory)}")
        else:
            slow_print("Your inventory is empty.")
    
    def get_command(self):
        print("\nWhat would you like to do?")
        print("(go [place], take [item], hint, look, quit)")
        return input("> ").lower().strip()
    
    def process_command(self, command):
        self.moves += 1
        
        if command == "quit":
            return False
        
        elif command == "look":
            # Just show the location again
            pass
        
        elif command.startswith("go "):
            destination = command[3:].strip()
            if destination in self.locations[self.current_location]["connections"]:
                self.current_location = destination
                slow_print(f"You go to the {destination}.")
                
                # Check if Tilly is here
                if self.current_location == self.tilly_location:
                    self.win_game()
                    return False
            else:
                slow_print(f"You can't go to {destination} from here.")
        
        elif command.startswith("take "):
            item = command[5:].strip()
            if item in self.locations[self.current_location]["items"]:
                self.inventory.append(item)
                self.locations[self.current_location]["items"].remove(item)
                slow_print(f"You take the {item}.")
            else:
                slow_print(f"There's no {item} here.")
        
        elif command == "hint":
            self.hints_used += 1
            if self.current_location == self.tilly_location:
                slow_print("Tilly is very close! Look carefully!")
            else:
                # Find the path to Tilly
                current = self.current_location
                target = self.tilly_location
                
                # Simple hint - just tell which connected room to go to
                best_next_step = None
                for connection in self.locations[current]["connections"]:
                    if connection == target:
                        best_next_step = connection
                        break
                
                if best_next_step:
                    slow_print(f"I think you should check the {best_next_step}!")
                else:
                    slow_print("Tilly is hiding somewhere else. Keep exploring!")
        
        else:
            slow_print("I don't understand that command.")
        
        return True
    
    def win_game(self):
        clear_screen()
        slow_print("*" * 50)
        slow_print(f"CONGRATULATIONS, {self.player_name}!")
        slow_print(f"You found Tilly in the {self.tilly_location}!")
        slow_print(f"It took you {self.moves} moves and {self.hints_used} hints.")
        slow_print("*" * 50)
        input("Press Enter to exit...")
    
    def game_loop(self):
        playing = True
        while playing:
            clear_screen()
            self.show_location()
            command = self.get_command()
            playing = self.process_command(command)

if __name__ == "__main__":
    game = Game()
    game.start()
