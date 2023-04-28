import subprocess
import os
import shutil

"""
This script generates a directory of .svg files font from a corresponding directory of .png files.
It utilizes the subprocess, os, shutil, and potrace libraries to make calls to the terminal. 
The general flow requires initial conversion from a .png to a .pnm file and then from a .pnm to a .svg file.
"""

current_dir = "send-letters/server/handwriting/"

# Create a temporary folder for all the pnm files
pnm_directory = current_dir + "pnm_files"
if not os.path.exists(pnm_directory):
    os.makedirs(pnm_directory)

# Open all files from the png directory
png_directory = current_dir + "png_files"
for filename in os.listdir(png_directory):
    f = os.path.join(png_directory, filename)
    
    # Break if file is not a '.pvg' file
    if not os.path.isfile(f) or not filename[-4:] == ".png":
        break

    png_file = current_dir + "png_files/" + filename
    pnm_file = current_dir + "pnm_files/" + filename[:-4] + ".pnm" 
    svg_file = current_dir + "svg_files/" + filename[:-4] + ".svg"

    # Run command on terminal to convert the png file to a pnm file and 
    #   then another command to convert the pnm file to an svg file
    subprocess.run(["convert", png_file, pnm_file])
    subprocess.run(["potrace", pnm_file, "-s", "-o", svg_file])

# Remove temporary pnm directory and all .pnm files
shutil.rmtree(pnm_directory, ignore_errors=False, onerror=None)
