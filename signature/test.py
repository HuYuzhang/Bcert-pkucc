from bls.scheme import *


params1 = setup()
(sk1, vk1) = ttp_keygen(params1, 3, 4)
aggr_vk1 = aggregate_vk(params1, vk1)
m = "12345"
signature1 = sign(params1, sk1[0], m)
signature2 = sign(params1, sk1[1], m)
signature3 = sign(params1, sk1[2], m)
sigs = [signature1,signature2,signature3]
sigma = aggregate_sigma(params1, sigs)
print(verify(params1, aggr_vk1, sigma, m))

params2 = setup()
(sk2, vk2) = ttp_keygen(params2, 3, 4)
aggr_vk2 = aggregate_vk(params2, vk2)
print(verify(params2, aggr_vk1, sigma, m))
print(verify(params2, aggr_vk2, sigma, m))