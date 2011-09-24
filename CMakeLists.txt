PROJECT(CPPBUILD)                                                                                                     
CMAKE_MINIMUM_REQUIRED(VERSION 2.4.5)

INCLUDE(${PROJECT_SOURCE_DIR}/cxx/CMakeLists.txt)

#SET(BOOST_INCLUDE_PATH "/boost" CACHE PATH "Plase set include-path to boost")
#SET(BOOST_LINK_PATH "/boost" CACHE PATH "Plase set link-path to boost")
 
#IF(WIN32)
#	INCLUDE_DIRECTORIES(${PROJECT_SOURCE_DIR} ${BOOST_INCLUDE_PATH})
#    LINK_DIRECTORIES(${PROJECT_SOURCE_DIR} ${BOOST_LINK_PATH})
#ENDIF(WIN32)
#IF(UNIX)
#    INCLUDE_DIRECTORIES(${PROJECT_SOURCE_DIR} /usr/include /usr/local/include ${BOOST_INCLUDE_PATH})
#    LINK_DIRECTORIES(${PROJECT_SOURCE_DIR} /usr/lib /usr/lib ${BOOST_LINK_PATH})
#ENDIF(UNIX)
 
#OPTION(MAKE_MODULE "make as module." true)
#OPTION(MAKE_SHARED "make as shared" false)
#OPTION(MAKE_STATIC "make as static" false)
 
#SET(OUTPUT_FILENAME "NiconamaClient" CACHE STRING "Please set output filename.")
 
#SET(INFO_OUTFILE_NAME "niconamaclient" CACHE STRING "niconamaclient.cc build")
 
#IF(MAKE_STATIC)
#    ADD_LIBRARY(${OUTPUT_FILENAME} STATIC ${PROJECT_SOURCE_DIR}/NiconamaClient.cpp)
#    ADD_LIBRARY(${niconamaclient} STATIC ${PROJECT_SOURCE_DIR}/niconamaclient.cc)
#ELSEIF(MAKE_SHARED)
#    ADD_LIBRARY(${OUTPUT_FILENAME} SHARED ${PROJECT_SOURCE_DIR}/NiconamaClient.cpp)
#    ADD_LIBRARY(${niconamaclient} SHARED ${PROJECT_SOURCE_DIR}/niconamaclient.cc)
#ELSEIF(MAKE_MODULE)
#    ADD_LIBRARY(${OUTPUT_FILENAME} MODULE ${PROJECT_SOURCE_DIR}/NiconamaClient.cpp)
#    ADD_LIBRARY(${niconamaclient} MODULE ${PROJECT_SOURCE_DIR}/niconamaclient.cc)
#ENDIF()
