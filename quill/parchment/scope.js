let Scope = {
	TYPE: 3, // 0011 Lower two bits
	LEVEL: 12, // 1100 Higher two bits

	ATTRIBUTE: 13, // 1101
	BLOT: 14, // 1110
	INLINE: 7, // 0111
	BLOCK: 11, // 1011

	BLOCK_BLOT: 10, // 1010
	INLINE_BLOT: 6, // 0110
	BLOCK_ATTRIBUTE: 9, // 1001
	INLINE_ATTRIBUTE: 5, // 0101

	ANY: 15
};

export default Scope;

