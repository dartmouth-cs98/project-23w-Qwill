import fontforge
import os


current_dir = "send-letters/handwriting/"

# Set output file names
output_ttf= current_dir + "Qwill-font-test.ttf"

# Create a new font object
font = fontforge.font()

# Set font properties
font.fontname = 'Qwill Test'
font.familyname = 'Qwill Test'
font.em = 1000
font.ascent = 800
font.descent = 200

# Initialize a fontforge font intially filled with the glyphs from the LibreBaskerville-Regular font
font = fontforge.open(current_dir + "LibreBaskerville-Regular.ttf")

# Open all files from the svg directory
directory = current_dir + "svg_files"
for filename in os.listdir(directory):
    f = os.path.join(directory, filename)
    
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
