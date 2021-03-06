import { expect } from 'chai';
import ByteStream from '../src/byteStream';
import readDicomElementExplicit from '../src/readDicomElementExplicit';
import littleEndianByteArrayParser from '../src/littleEndianByteArrayParser';

describe('readDicomElementExplicit', () => {

  it('should return an element', () => {
    // Arrange
    const byteArray = new Uint8Array(32);
    const byteStream = new ByteStream(littleEndianByteArrayParser, byteArray);

    // Act
    const element = readDicomElementExplicit(byteStream);

    // Assert
    expect(element).to.be.ok;
  });

  it('should parse the tag correctly', () => {
    // Arrange
    const byteArray = new Uint8Array(32);

    byteArray[0] = 0x11;
    byteArray[1] = 0x22;
    byteArray[2] = 0x33;
    byteArray[3] = 0x44;
    
    const byteStream = new ByteStream(littleEndianByteArrayParser, byteArray);

    // Act
    const element = readDicomElementExplicit(byteStream);

    // Assert
    expect(element.tag).to.equal('x22114433');
  });

  it('should parsed vr correctly', () => {
    // Arrange
    const byteArray = new Uint8Array(32);

    byteArray[0] = 0x11;
    byteArray[1] = 0x22;
    byteArray[2] = 0x33;
    byteArray[3] = 0x44;
    byteArray[4] = 0x53; // ST
    byteArray[5] = 0x54;

    const byteStream = new ByteStream(littleEndianByteArrayParser, byteArray);

    // Act
    const element = readDicomElementExplicit(byteStream);

    // Assert
    expect(element.vr).to.equal('ST');
  });

  it('should parse element for 2 bytes length correctly', () => {
    // Arrange
    const byteArray = new Uint8Array(1024);

    byteArray[0] = 0x11;
    byteArray[1] = 0x22;
    byteArray[2] = 0x33;
    byteArray[3] = 0x44;
    byteArray[4] = 0x53; // ST
    byteArray[5] = 0x54;
    byteArray[6] = 0x01; // length of 513
    byteArray[7] = 0x02;

    const byteStream = new ByteStream(littleEndianByteArrayParser, byteArray);

    // Act
    const element = readDicomElementExplicit(byteStream);

    // Assert
    expect(element.length).to.equal(513);
  });

  it('should parse element for 4 bytes length correctly', () => {
    // Arrange
    const byteArray = new Uint8Array(16909060 + 12);

    byteArray[0] = 0x11;
    byteArray[1] = 0x22;
    byteArray[2] = 0x33;
    byteArray[3] = 0x44;
    byteArray[4] = 0x4F; // OB
    byteArray[5] = 0x42;
    byteArray[6] = 0x00;
    byteArray[7] = 0x00;
    byteArray[8] = 0x04; // 4    overall length = 16909060 = (16777216 + 131072 + 768 + 4)
    byteArray[9] = 0x03; // 768
    byteArray[10] = 0x02; // 131072
    byteArray[11] = 0x01; // 16777216

    const byteStream = new ByteStream(littleEndianByteArrayParser, byteArray);

    // Act
    const element = readDicomElementExplicit(byteStream);

    // Assert
    expect(element.length).to.equal(16909060);
  });

  it('should parse element and return the right data offset', () => {
    // Arrange
    const byteArray = new Uint8Array(16909060 + 12);
  
    byteArray[0] = 0x11;
    byteArray[1] = 0x22;
    byteArray[2] = 0x33;
    byteArray[3] = 0x44;
    byteArray[4] = 0x4F; // OB
    byteArray[5] = 0x42;
    byteArray[6] = 0x00;
    byteArray[7] = 0x00;
    byteArray[8] = 0x04; // 4    overall length = 16909060 = (16777216 + 131072 + 768 + 4)
    byteArray[9] = 0x03; // 768
    byteArray[10] = 0x02; // 131072
    byteArray[11] = 0x01; // 16777216
  
    const byteStream = new ByteStream(littleEndianByteArrayParser, byteArray);

    // Act
    const element = readDicomElementExplicit(byteStream);

    // Assert
    expect(element.dataOffset).to.equal(12);
  });

});
