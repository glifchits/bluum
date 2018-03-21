import random
from coffee.models import Roaster, Coffee, Brew

input('about to delete all data in prod. Continue?')
Roaster.objects.all().delete()
Coffee.objects.all().delete()
Brew.objects.all().delete()

philseb = Roaster(name='Phil & Sebastian')
philseb.save()
horse = Roaster(name='Kicking Horse')
horse.save()
detour = Roaster(name='Detour Coffee Roasters')
detour.save()

for name, region in \
    [('Alfonso Mateus', 'Colombia'),
    ('Gaharo Hill', 'Burundi'),
    ('Guarnizo Bros.', 'Colombia'),
    ('Hartmanns\' Maragogype', 'Panama')]:
    c = Coffee(roaster=philseb, name=name, regions=region.split(', '))
    c.save()

for name, region in \
    [('Hola', 'Central America, South America'),
    ('Smart Ass', 'Africa, Central America, South America')]:
    c = Coffee(roaster=horse, name=name, regions=region.split(', '))
    c.save()

for name, region in \
    [('La Esperanza', 'Colombia'),
    ('Cachoeira MicroLot', 'Brazil'),
    ('Santa Teresa', 'Costa Rica'),
    ('Detour Dark', 'Guatemala, Brazil')]:
    c = Coffee(roaster=detour, name=name, regions=region.split(', '))
    c.save()
