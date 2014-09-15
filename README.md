SwitchJMF
=========

Switch script package designed to get a response from an HP Indigo DFE. This script builds a temporary bash script containing a cURL command. The cURL command sends a JMF to a print device and receives back the response. The response is saved as metadata and so the values may be used in other parts of the Switch flow. As of now, the only two JMF options are basic status and detail status. I'll add more options later.

Requirements:
- cURL
- Ability to run bash scripts
