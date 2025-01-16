<?php

namespace App\Http\Controllers\api\Common;

use App\Helpers\ApiResponse;
use App\Interfaces\Common\ReligionRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Common\Religion\StoreReligionRequest;
use App\Http\Requests\Common\Religion\UpdateReligionRequest;
use Illuminate\Support\Facades\DB ;
use App\Http\Resources\Common\ReligionResource;

class ReligionController extends Controller
{
    private ReligionRepositoryInterface $religionRepository;
    
    public function __construct(ReligionRepositoryInterface $religionRepository)
    {
        $this->religionRepository = $religionRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page') ?? 0;
        $search = $request->query('search');

        $filters = [];

        $data = $this->religionRepository->get($filters, $perPage, []);

        if($perPage){
            $religions = [
                'data' => ReligionResource::collection($data->items()),  // The actual resource data
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'per_page' => $data->perPage(),
                    'total_count' => $data->total(),
                    'total_pages' => $data->lastPage(),
                ]
            ];
                
            return response()->json($religions,200);
        }else{
            $religions = ReligionResource::collection($data);
            return ApiResponse::sendResponse($religions,'','success', 200);
        }

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReligionRequest $request)
    {
        DB::beginTransaction();
        try{
            $data = $request->all();
            $religion = $this->religionRepository->create($data);

            DB::commit();
            return ApiResponse::sendResponse($religion,'Religion Create Successful','success', 201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $religion = $this->religionRepository->find($id);

        return ApiResponse::sendResponse(new ReligionResource($religion),'', 'success', 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update($id, UpdateReligionRequest $request)
    {
        DB::beginTransaction();
        try{
            $religion = $this->religionRepository->update($id, $request->all());

            DB::commit();
            return ApiResponse::sendResponse( $religion , 'Religion Successful','success',201);

        }catch(\Exception $ex){
            return ApiResponse::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->religionRepository->delete($id);
        
        return ApiResponse::sendResponse('Religion Delete Successful','',204);
    }

}
