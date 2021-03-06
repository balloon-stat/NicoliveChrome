#SET(BOOST_INCLUDE_PATH "/opt/local/include" CACHE PATH "Plase set include-path to boost")
#SET(BOOST_LINK_PATH "/opt/local/lib" CACHE PATH "Plase set link-path to boost")

OPTION(MAKE_MODULE "make as module." true)
OPTION(MAKE_SHARED "make as shared" false)
OPTION(MAKE_STATIC "make as static" false)

SET(OUTPUT_FILENAME "NiconamaClient" CACHE STRING "Please set output filename.")
 
SET(INFO_OUTFILE_NAME "niconamaclient" CACHE STRING "niconamaclient.cc build")

IF(WIN32)
	INCLUDE_DIRECTORIES(${PROJECT_SOURCE_DIR} ${PROJECT_SOURCE_DIR}/npapisdk/include)
    LINK_DIRECTORIES(${PROJECT_SOURCE_DIR})
ENDIF(WIN32)
IF(UNIX)
	INCLUDE_DIRECTORIES(${CMAKE_CURRENT_BINARY_DIR} ${PROJECT_SOURCE_DIR} /usr/include /usr/local/include ${PROJECT_SOURCE_DIR}/npapisdk/include)
    LINK_DIRECTORIES(${PROJECT_SOURCE_DIR} /usr/lib /usr/lib)
ENDIF(UNIX)

IF(MAKE_STATIC)
	ADD_LIBRARY(${OUTPUT_FILENAME} STATIC ${PROJECT_SOURCE_DIR}/cxx/NiconamaClient.cpp)
    ADD_LIBRARY(${niconamaclient} STATIC ${PROJECT_SOURCE_DIR}/cxx/niconamaclient.cc)
ELSEIF(MAKE_SHARED)
    ADD_LIBRARY(${OUTPUT_FILENAME} SHARED ${PROJECT_SOURCE_DIR}/cxx/NiconamaClient.cpp)
    ADD_LIBRARY(${niconamaclient} SHARED ${PROJECT_SOURCE_DIR}/cxx/niconamaclient.cc)
ELSEIF(MAKE_MODULE)
    ADD_LIBRARY(${OUTPUT_FILENAME} MODULE ${PROJECT_SOURCE_DIR}/cxx/NiconamaClient.cpp)
    ADD_LIBRARY(${niconamaclient} MODULE ${PROJECT_SOURCE_DIR}/cxx/niconamaclient.cc)
ENDIF()
TARGET_LINK_LIBRARIES(${OUTPUT_FILENAME} boost_system boost_thread)
