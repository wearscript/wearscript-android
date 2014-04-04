package com.dappervision.picarus;
interface IPicarusService {
	byte[] processBinaryOld(in byte[] config, in byte[] input);
	long createModel(in byte[] config);
	byte[] processBinary(in long model, in byte[] input);
	void deleteModel(in long model);
}