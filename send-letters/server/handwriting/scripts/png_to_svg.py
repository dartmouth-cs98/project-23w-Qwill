import subprocess
import sys
import os
import shutil


"""
This function generates a directory of .svg files font from a corresponding directory of .png files.
It utilizes the subprocess, os, shutil, and potrace libraries to make calls to the terminal. 
The general flow requires initial conversion from a .png to a .pnm file and then from a .pnm to a .svg file.
"""
def convert_png_dir_to_svg_dir(png_dir):
    # Create temporary folders for all the pnm and svg files
    pnm_dir = os.path.join(os.path.dirname(png_dir), "pnm_files")
    if not os.path.exists(pnm_dir):
        os.makedirs(pnm_dir)

    svg_dir = os.path.join(os.path.dirname(png_dir), "svg_files")
    if not os.path.exists(svg_dir):
        os.makedirs(svg_dir)

    # Open all files from the png directory
    for filename in os.listdir(png_dir):
        f = os.path.join(png_dir, filename)
        
        # Break if file is not a '.pvg' file
        if not os.path.isfile(f) or not filename[-4:] == ".png":
            break

        png_file = os.path.join(png_dir, filename)
        pnm_file = os.path.join(pnm_dir, filename[:-4] + ".pnm")
        svg_file = os.path.join(svg_dir, filename[:-4] + ".svg")

        # Run command on terminal to convert the png file to a pnm file and 
        #   then another command to convert the pnm file to an svg file
        subprocess.run(["convert", png_file, pnm_file])
        subprocess.run(["potrace", pnm_file, "-s", "-o", svg_file])

    # Remove old png directory,temporary pnm directory, and all contained files
    shutil.rmtree(png_dir, ignore_errors=True, onerror=None)
    shutil.rmtree(pnm_dir, ignore_errors=True, onerror=None)


if __name__ == "__main__":
    server_dir = sys.argv[0][:-33]
    png_dir = os.path.join(server_dir, "temp/png_files")
    convert_png_dir_to_svg_dir(png_dir)

    # Clear all of temp directory
    # shutil.rmtree(os.path.join(server_dir, "temp/"), ignore_errors=True, onerror=None)
