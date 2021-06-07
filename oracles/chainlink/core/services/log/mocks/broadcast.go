// Code generated by mockery 2.7.4. DO NOT EDIT.

package mocks

import (
	common "github.com/ethereum/go-ethereum/common"

	mock "github.com/stretchr/testify/mock"

	types "github.com/ethereum/go-ethereum/core/types"
)

// Broadcast is an autogenerated mock type for the Broadcast type
type Broadcast struct {
	mock.Mock
}

// DecodedLog provides a mock function with given fields:
func (_m *Broadcast) DecodedLog() interface{} {
	ret := _m.Called()

	var r0 interface{}
	if rf, ok := ret.Get(0).(func() interface{}); ok {
		r0 = rf()
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(interface{})
		}
	}

	return r0
}

// LatestBlockHash provides a mock function with given fields:
func (_m *Broadcast) LatestBlockHash() common.Hash {
	ret := _m.Called()

	var r0 common.Hash
	if rf, ok := ret.Get(0).(func() common.Hash); ok {
		r0 = rf()
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(common.Hash)
		}
	}

	return r0
}

// LatestBlockNumber provides a mock function with given fields:
func (_m *Broadcast) LatestBlockNumber() uint64 {
	ret := _m.Called()

	var r0 uint64
	if rf, ok := ret.Get(0).(func() uint64); ok {
		r0 = rf()
	} else {
		r0 = ret.Get(0).(uint64)
	}

	return r0
}

// MarkConsumed provides a mock function with given fields:
func (_m *Broadcast) MarkConsumed() error {
	ret := _m.Called()

	var r0 error
	if rf, ok := ret.Get(0).(func() error); ok {
		r0 = rf()
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// RawLog provides a mock function with given fields:
func (_m *Broadcast) RawLog() types.Log {
	ret := _m.Called()

	var r0 types.Log
	if rf, ok := ret.Get(0).(func() types.Log); ok {
		r0 = rf()
	} else {
		r0 = ret.Get(0).(types.Log)
	}

	return r0
}

// SetDecodedLog provides a mock function with given fields: _a0
func (_m *Broadcast) SetDecodedLog(_a0 interface{}) {
	_m.Called(_a0)
}

// String provides a mock function with given fields:
func (_m *Broadcast) String() string {
	ret := _m.Called()

	var r0 string
	if rf, ok := ret.Get(0).(func() string); ok {
		r0 = rf()
	} else {
		r0 = ret.Get(0).(string)
	}

	return r0
}

// WasAlreadyConsumed provides a mock function with given fields:
func (_m *Broadcast) WasAlreadyConsumed() (bool, error) {
	ret := _m.Called()

	var r0 bool
	if rf, ok := ret.Get(0).(func() bool); ok {
		r0 = rf()
	} else {
		r0 = ret.Get(0).(bool)
	}

	var r1 error
	if rf, ok := ret.Get(1).(func() error); ok {
		r1 = rf()
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}
