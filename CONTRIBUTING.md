Contribution Guide:

Mergerequets:	1. Bei Gitlab den Mergerequest erstellen und Branch anlegen.
        		2. Jetzt ist der Master schon im Branch (wenn aus irgendeinem Grund nicht 
        		3. Nun in diesen Branch arbeiten.
	        	4. Wenn fertig dann den derzeitigen Master pullen/fetchen
	        	5. Bei IntelliJ den Pfeil hinten beim Master "merge into current" drücken.
	        	6. Evtl. vorhanden Conflicts beheben
        		7. Nun in IntelliJ seinen Branch commiten, kommentar nicht vergessen
	        	8. git push im Terminal von IntelliJ, oder anders pushen
		
Code: 	-Wir benutzen einen K&R Style
    	-Einrückungstiefe beträgt 4 Leerzeichen
    	-getter werden beispielsweise "getHealth" benannt
    	-im Allgemeinen werden Methoden klein geschrieben, wenn der Name aus 2 	Wörtern zusammengesetzt ist, 
    	wird das 2. Wort mit einem Großbuchstaben 	angenfangen um es zu verdeutlichen, bspw: "playerInput"
    	
Commit-Messages:    -Kurz erklären was und wieso geändert, dies kann sehr kurz gefasst sein,
                     aber sollte recht deutlich sein. Ihr müsst euch jetzt nicht den Kopf zerschlagen darüber alles perfekt zusammenzufassen aber es sollte möglich sein es nachzuvollziehen.
    
Bug-reports: 	-reproduzierbar Fehler beschreiben /evtl. screenshots 
	        	-Wann der Fehler im Programm auftritt
	        	-Seit wann der Fehler bekannt ist