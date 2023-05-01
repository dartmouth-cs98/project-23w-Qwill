import fontforge
import os
import sys

"""
This script generates a .ttf font from a directory of .svg files
Requirements:
* the fontforge library installed
* a directory of .svg files where each file is titles with the name of the unicode value for the character
* a filler font utilized below to fill in all characters not included in the .svg file directory
"""
def generate_font(svg_dir, default_font_path):
    # Set output file names
    output_ttf = os.path.join(os.path.dirname(svg_dir), "Qwill-font-test.ttf")

    # Create a new font object
    font = fontforge.font()

    # Set font properties
    font.fontname = 'Qwill Test'
    font.familyname = 'Qwill Test'
    font.em = 1000
    font.ascent = 800
    font.descent = 200

    # Initialize a fontforge font intially filled with the glyphs from the LibreBaskerville-Regular font
    font = fontforge.open(default_font_path)

    # Open all files from the svg directory
    for filename in os.listdir(svg_dir):
        f = os.path.join(svg_dir, filename)
        
        # Break if file is not a '.svg' file
        if not os.path.isfile(f) or not filename[-4:] == '.svg':
            break
            
        # Create the new glyph from the file and replace the initialized glyph with the handwritten glyph
        glyph_unicode = int(filename[:-4])  # file should be named using integer encoding
        handwritten_glyph = font.createChar(glyph_unicode)
        handwritten_glyph.clear()
        handwritten_glyph.importOutlines(f)

    # Generate the .ttf file from the font
    font.generate(output_ttf)


if __name__ == "__main__":
    server_dir = sys.argv[0][:-38]
    svg_dir = os.path.join(server_dir, "temp/svg_files")
    default_font_path = os.path.join(server_dir, "handwriting/LibreBaskerville-Regular.ttf")
    generate_font(svg_dir, default_font_path)

    # Clear all of svg directory
	# shutil.rmtree(svg_dir, ignore_errors=True, onerror=None)
